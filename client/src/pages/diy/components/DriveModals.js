import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Popover,
  Stack,
  useMediaQuery
} from '@mui/material';
import {
  FolderOpenIcon,
  LinkIcon,
  TrashIcon,
  EyeIcon,
  DownloadIcon,
  TypeBadge,
  CopyIcon,
  EditIcon
} from '../icons/DriveIcons';
import { CalendarMonth } from './CalendarMonth';
import { addMonths, downloadFile, getTypeKey } from '../utils/driveHelpers';

const modalBackdropSx = {
  backdropFilter: 'blur(2px) !important',
  WebkitBackdropFilter: 'blur(2px) !important',
  bgcolor: 'rgba(123, 136, 149, 0.3)'
};

/* ---------- Xem trước nội dung tệp ---------- */

// Điện thoại: khung xem vừa khít hộp thoại (hộp thoại không phải cuộn, chỉ nội dung bên trong cuộn).
// Máy tính: giữ 65vh như cũ.
const PREVIEW_HEIGHT = { xs: 'calc(100dvh - 210px)', sm: '65vh' };
const OFFICE_HEIGHT = { xs: 'calc(100dvh - 270px)', sm: '65vh' }; // trừ thêm dòng gợi ý + nút tải lại

// iPhone/iPad: khung nhúng PDF chỉ hiện trang đầu và không cuộn được, nên dùng Google Viewer
const isIOSDevice = () =>
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// Tệp văn bản: đọc nội dung rồi hiện trực tiếp (giới hạn 200KB cho nhẹ)
const TextPreview = ({ url, C }) => {
  const [text, setText] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setText(null);
    setFailed(false);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('fetch lỗi');
        return res.text();
      })
      .then((t) => alive && setText(t.length > 200000 ? `${t.slice(0, 200000)}\n…` : t))
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [url]);

  if (failed) {
    return <Typography sx={{ fontSize: 14, color: C.textSub, py: 3 }}>Không đọc được nội dung tệp, hãy tải xuống để xem.</Typography>;
  }
  if (text === null) {
    return <Typography sx={{ fontSize: 14, color: C.textSub, py: 3 }}>Đang tải nội dung...</Typography>;
  }
  return (
    <Box
      component="pre"
      sx={{
        m: 0, p: 2, maxHeight: PREVIEW_HEIGHT, overflow: 'auto', overscrollBehavior: 'contain', textAlign: 'left',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        fontSize: 13, lineHeight: 1.6, color: C.text,
        border: `1px solid ${C.line}`, borderRadius: '12px', bgcolor: C.fieldBg,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
      }}
    >
      {text}
    </Box>
  );
};

// Bật sandbox cho khung xem Google (chặn tự tải xuống, vì sandbox không có "allow-downloads").
// Hiện TẮT vì sandbox có thể làm trình xem Google không cuộn được; muốn thử bật lại thì đổi thành true.
const USE_FRAME_SANDBOX = false;
const SAFE_FRAME_SANDBOX = USE_FRAME_SANDBOX
  ? 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms'
  : undefined;

// Word / Excel / PowerPoint: chỉ xem bằng Google Viewer
const OfficePreview = ({ file, C, frameSx }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const src = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.url)}`;

  // Đổi sang tệp khác thì tải lại khung từ đầu
  useEffect(() => {
    setReloadKey(0);
  }, [file.url]);

  return (
    <>
      <Box
        component="iframe"
        key={`${src}-${reloadKey}`}
        src={src}
        title={file.name}
        sandbox={SAFE_FRAME_SANDBOX}
        sx={{ ...frameSx, height: OFFICE_HEIGHT }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        <Typography sx={{ fontSize: 13, color: C.textSub, textAlign: 'left', flex: 1, minWidth: 200 }}>
          Nếu khung xem trống, bấm Tải lại khung xem (Google đôi khi cần tải lần thứ hai).
        </Typography>
        <Button
          onClick={() => setReloadKey((k) => k + 1)}
          sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, color: C.text }}
        >
          Tải lại khung xem
        </Button>
      </Box>
    </>
  );
};

// PDF: đọc tệp về dạng blob rồi hiện bằng blob URL, trình duyệt luôn mở xem tại chỗ
// (nếu nhúng thẳng link Cloudinary mà server trả header "attachment" thì trình duyệt sẽ tự tải về)
const PdfPreview = ({ file, C, frameSx }) => {
  const [src, setSrc] = useState(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let alive = true;
    let objectUrl = null;
    setSrc(null);
    setFallback(false);

    if (isIOSDevice()) {
      setFallback(true);
      return undefined;
    }

    (async () => {
      try {
        const res = await fetch(file.url);
        if (!res.ok) throw new Error('fetch lỗi');
        const blob = await res.blob();
        if (!alive) return;
        // Ép đúng loại PDF để trình duyệt hiển thị thay vì tải xuống
        objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        setSrc(objectUrl);
      } catch (err) {
        console.warn('Không đọc được PDF bằng blob, chuyển sang trình xem Google:', err);
        if (alive) setFallback(true);
      }
    })();

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.url]);

  if (fallback) {
    const gview = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.url)}`;
    return <Box component="iframe" src={gview} title={file.name} sandbox={SAFE_FRAME_SANDBOX} sx={frameSx} />;
  }
  if (!src) {
    return <Typography sx={{ fontSize: 14, color: C.textSub, py: 3 }}>Đang tải tài liệu...</Typography>;
  }
  return <Box component="iframe" src={src} title={file.name} sx={frameSx} />;
};

// Chọn cách hiển thị theo loại tệp
const FilePreview = ({ file, C }) => {
  if (!file) return null;

  const type = getTypeKey(file, false);
  const frameSx = {
    width: '100%', height: PREVIEW_HEIGHT, minHeight: 240,
    border: `1px solid ${C.line}`, borderRadius: '12px', bgcolor: '#fff'
  };

  if (type === 'image') {
    return (
      <Box
        component="img"
        src={file.url}
        alt={file.name}
        sx={{ maxWidth: '100%', maxHeight: PREVIEW_HEIGHT, borderRadius: '12px', objectFit: 'contain' }}
      />
    );
  }

  if (type === 'pdf') {
    return <PdfPreview file={file} C={C} frameSx={frameSx} />;
  }

  if (type === 'video') {
    return <Box component="video" controls src={file.url} sx={{ width: '100%', maxHeight: PREVIEW_HEIGHT, borderRadius: '12px', bgcolor: '#000' }} />;
  }

  if (type === 'audio') {
    return <Box component="audio" controls src={file.url} sx={{ width: '100%', mt: 2 }} />;
  }

  // Word / Excel / PowerPoint: chỉ xem bằng Google Viewer
  if (type === 'word' || type === 'excel' || type === 'powerpoint') {
    return <OfficePreview file={file} C={C} frameSx={frameSx} />;
  }

  if (type === 'txt') {
    return <TextPreview url={file.url} C={C} />;
  }

  // Các định dạng còn lại (zip, psd, ai...): không xem trực tiếp được
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography sx={{ fontSize: 14, color: C.textSub }}>
        Định dạng này chưa xem trực tiếp được, hãy bấm Tải xuống để mở bằng ứng dụng trên máy.
      </Typography>
    </Box>
  );
};

export const DriveModals = ({
  // State Date
  isDateOpen,
  setIsDateOpen,
  leftMonth,
  setLeftMonth,
  rightMonth,
  setRightMonth,
  draftRange,
  setDraftRange,
  handlePickDay,
  handleApplyDate,

  // State Popover Type
  typeAnchor,
  setTypeAnchor,
  FILTER_TYPES,
  draftTypes,
  toggleDraftType,
  setDraftTypes,
  handleApplyType,

  // State Menu Context
  menu,
  handleCloseMenu,
  menuPaperSx,
  menuItemSx,
  menuItemDangerSx,
  handleOpenFolder,
  handleShareFolder,
  handleAskDelete,
  setSelectedPreview,
  isAdmin,

  // State Modal Preview File
  selectedPreview,
  dialogBoxSx,
  modalBoxSx,
  outlineBtnSx,
  darkBtnSx,
  dangerBtnSx,

  // State Modal Create Folder
  isCreateFolderOpen,
  handleCloseCreateFolder,
  handleCreateFolderSubmit,
  newFolderName,
  setNewFolderName,

  // State Modal Rename
  renameTarget,
  setRenameTarget,
  newName,
  setNewName,
  isRenaming,
  handleAskRename,
  handleConfirmRename,

  // State Modal Delete
  deleteTarget,
  setDeleteTarget,
  isDeleting,
  handleConfirmDelete,

  // State Modal Share
  shareLinkModal,
  setShareLinkModal,
  handleCopyShareLink,

  // Props mới cho Modal Lựa chọn Upload & Nhập Link
  choiceModalOpen,
  setChoiceModalOpen,
  fileInputRef,
  onUploadLink,

  C
}) => {
  // Điện thoại / màn hình cảm ứng: khóa cuộn trang nền khi đang xem trước, để vuốt là cuộn nội dung xem trước.
  // Máy tính giữ disableScrollLock để header không bị dịch khi thanh cuộn biến mất.
  const lockScroll = useMediaQuery('(pointer: coarse), (max-width: 600px)');

  // State phụ quản lý riêng Modal nhập link Google Docs/Sheets
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Xử lý khi chọn Tải lên từ máy tính
  const handleSelectBrowser = () => {
    setChoiceModalOpen(false);
    fileInputRef.current?.click();
  };

  // Xử lý khi chọn Thêm liên kết
  const handleSelectLinkOption = () => {
    setChoiceModalOpen(false);
    setLinkModalOpen(true);
  };

  // Xử lý Submit Link Google Docs / Sheets
  const handleSubmitLink = async (e) => {
    e.preventDefault();
    if (!linkUrl.trim() || isAddingLink) return;

    let ok = true;
    if (onUploadLink) {
      setIsAddingLink(true);
      // name để trống thì server tự đặt tên theo tài liệu
      ok = await onUploadLink({
        name: linkName.trim(),
        url: linkUrl.trim(),
        type: 'link'
      });
      setIsAddingLink(false);
    }

    // Lỗi thì giữ nguyên nội dung để người dùng sửa lại đường dẫn
    if (ok === false) return;

    setLinkName('');
    setLinkUrl('');
    setLinkModalOpen(false);
  };

  return (
    <>
      {/* MODAL CHỌN NGÀY */}
      <Modal
        BackdropProps={{ sx: modalBackdropSx }}
        disableScrollLock
        open={isDateOpen}
        onClose={() => setIsDateOpen(false)}
      >
        <Box sx={{ ...modalBoxSx, width: 'min(860px, 94vw)', maxHeight: '92vh', overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 3 }}>
            Chọn khoảng ngày
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
            <CalendarMonth
              month={leftMonth}
              start={draftRange.start}
              end={draftRange.end}
              onPick={handlePickDay}
              onPrev={() => setLeftMonth((m) => addMonths(m, -1))}
              onNext={() => setLeftMonth((m) => addMonths(m, 1))}
              cTokens={C}
            />
            <CalendarMonth
              month={rightMonth}
              start={draftRange.start}
              end={draftRange.end}
              onPick={handlePickDay}
              onPrev={() => setRightMonth((m) => addMonths(m, -1))}
              onNext={() => setRightMonth((m) => addMonths(m, 1))}
              cTokens={C}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 3 }}>
            <Button
              onClick={() => setDraftRange({ start: null, end: null })}
              disabled={!draftRange.start}
              sx={{ ...outlineBtnSx, px: 2.5 }}
            >
              Xóa chọn
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setIsDateOpen(false)} sx={outlineBtnSx}>Hủy</Button>
              <Button onClick={handleApplyDate} sx={darkBtnSx}>Áp dụng</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* POPOVER LỌC LOẠI FILE */}
      <Popover
        open={Boolean(typeAnchor)}
        anchorEl={typeAnchor}
        onClose={() => setTypeAnchor(null)}
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1, p: 2, width: 'min(560px, 92vw)', borderRadius: '16px', backgroundImage: 'none',
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
          }
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {FILTER_TYPES.map((t) => {
            const active = draftTypes.includes(t.key);
            return (
              <Box
                key={t.key}
                component="button"
                type="button"
                onClick={() => toggleDraftType(t.key)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, minWidth: 0,
                  borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                  border: active ? `1px solid ${C.text}` : `1px dashed ${C.line}`,
                  bgcolor: active ? C.fieldBg : '#fff',
                  color: C.text, fontSize: 14, fontWeight: 500,
                  '&:hover': { bgcolor: C.fieldBg },
                  fontFamily: 'kanit, sans-serif'
                }}
              >
                <TypeBadge type={t.key} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
          <Button onClick={() => setDraftTypes([])} sx={outlineBtnSx}>Xóa</Button>
          <Button onClick={handleApplyType} sx={darkBtnSx}>Áp dụng</Button>
        </Box>
      </Popover>

      {/* MENU ACTION CONTEXT */}
      <Menu
        open={Boolean(menu?.anchorEl)}
        anchorEl={menu?.anchorEl}
        onClose={handleCloseMenu}
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: menuPaperSx }}
        MenuListProps={{ sx: { p: 0, display: 'flex', flexDirection: 'column', gap: '2px' } }}
      >
        {menu?.type === 'FOLDER' && [
          <MenuItem key="open" sx={menuItemSx} onClick={() => handleOpenFolder(menu.target)}>
            <FolderOpenIcon /> Mở thư mục
          </MenuItem>,
          isAdmin && (
            <MenuItem key="rename-folder" sx={menuItemSx} onClick={() => handleAskRename('FOLDER', menu.target)}>
              <EditIcon /> Đổi tên
            </MenuItem>
          ),
          <MenuItem key="share" sx={menuItemSx} onClick={() => handleShareFolder(menu.target._id)}>
            <LinkIcon /> Lấy link chia sẻ
          </MenuItem>,
          <Divider key="divider-folder" sx={{ borderStyle: 'dashed', my: '2px !important' }} />,
          <MenuItem key="delete-folder" sx={menuItemDangerSx} onClick={() => handleAskDelete('FOLDER', menu.target)}>
            <TrashIcon /> Xóa thư mục
          </MenuItem>
        ]}
        {menu?.type === 'FILE' && [
          <MenuItem key="view" sx={menuItemSx} onClick={() => { setSelectedPreview(menu.target); handleCloseMenu(); }}>
            <EyeIcon /> Xem thử
          </MenuItem>,
          isAdmin && (
            <MenuItem key="rename-file" sx={menuItemSx} onClick={() => handleAskRename('FILE', menu.target)}>
              <EditIcon /> Đổi tên
            </MenuItem>
          ),
          menu.target.isExternal ? (
            <MenuItem key="open-link" sx={menuItemSx} component="a" href={menu.target.url} target="_blank" rel="noreferrer" onClick={handleCloseMenu}>
              <LinkIcon /> Mở liên kết
            </MenuItem>
          ) : (
            <MenuItem key="download" sx={menuItemSx} onClick={() => { downloadFile(menu.target); handleCloseMenu(); }}>
              <DownloadIcon /> Tải xuống
            </MenuItem>
          ),
          isAdmin && <Divider key="divider-file" sx={{ borderStyle: 'dashed', my: '2px !important' }} />,
          isAdmin && (
            <MenuItem key="delete-file" sx={menuItemDangerSx} onClick={() => handleAskDelete('FILE', menu.target)}>
              <TrashIcon /> Xóa tệp tin
            </MenuItem>
          )
        ]}
      </Menu>

      {/* MODAL XEM THỬ FILE */}
      <Modal
        disableScrollLock={!lockScroll}
        open={Boolean(selectedPreview)}
        onClose={() => setSelectedPreview(null)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box
          sx={{
            ...dialogBoxSx,
            maxWidth: '1000px', width: '94vw',
            maxHeight: { xs: 'calc(100dvh - 24px)', sm: '90vh' },
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
            overscrollBehavior: 'contain', // cuộn tới cuối thì không đẩy sang trang nền
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Typography
              title={selectedPreview?.name}
              sx={{
                fontSize: 18,
                fontWeight: 500,
                color: C.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}
            >
              {selectedPreview?.name}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            {selectedPreview?.isExternal ? (
              selectedPreview?.previewUrl ? (
                <>
                  <Box
                    component="iframe"
                    src={selectedPreview.previewUrl}
                    title={selectedPreview.name}
                    sandbox={SAFE_FRAME_SANDBOX}
                    sx={{ width: '100%', height: OFFICE_HEIGHT, minHeight: 240, border: `1px solid ${C.line}`, borderRadius: '12px', bgcolor: '#fff' }}
                  />
                  <Typography sx={{ fontSize: 13, color: C.textSub, mt: 1.5 }}>
                    Nếu khung xem trống, tài liệu cần được chia sẻ "bất kỳ ai có liên kết", hoặc bấm Mở liên kết.
                  </Typography>
                </>
              ) : (
                <Box sx={{ py: 4, px: 2 }}>
                  <Typography sx={{ fontSize: 14, color: C.textSub }}>
                    Tài liệu này không xem trước được tại đây, hãy mở liên kết để xem.
                  </Typography>
                </Box>
              )
            ) : (
              <FilePreview file={selectedPreview} C={C} />
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, pt: 2, borderTop: `1px dashed ${C.line}` }}>
            <Button onClick={() => setSelectedPreview(null)} sx={outlineBtnSx}>
              Đóng
            </Button>
            {selectedPreview?.isExternal ? (
              <Button
                component="a"
                href={selectedPreview?.url}
                target="_blank"
                rel="noreferrer"
                sx={darkBtnSx}
              >
                Mở liên kết
              </Button>
            ) : (
              <Button onClick={() => downloadFile(selectedPreview)} sx={darkBtnSx}>
                Tải xuống
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* MODAL TẠO THƯ MỤC */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={isCreateFolderOpen}
        onClose={handleCloseCreateFolder}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 3 }}>
            Tạo thư mục mới
          </Typography>

          <form onSubmit={handleCreateFolderSubmit}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25,
                borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
                '&:focus-within': { border: `1px solid ${C.text}` }
              }}
            >
              <TypeBadge type="folder" />
              <TextField
                fullWidth
                autoFocus
                variant="standard"
                placeholder="Nhập tên thư mục..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: 14, fontWeight: 500 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
              <Button onClick={handleCloseCreateFolder} sx={outlineBtnSx}>Hủy</Button>
              <Button
                type="submit"
                disabled={!newFolderName.trim()}
                sx={{ ...darkBtnSx, '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub } }}
              >
                Tạo
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* MODAL 1: LỰA CHỌN HÌNH THỨC TẢI LÊN */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={Boolean(choiceModalOpen)}
        onClose={() => setChoiceModalOpen(false)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 3 }}>
            Chọn hình thức tải lên
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleSelectBrowser}
              sx={{
                py: 1.5, justifyContent: 'flex-start', px: 2.5, borderRadius: '12px',
                border: `1px dashed ${C.line}`, color: C.text, fontWeight: 600, textTransform: 'none',
                '&:hover': {  border: `1px solid ${C.text}` }
              }}
            >
              📁 Tải lên từ máy tính (Browser)
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleSelectLinkOption}
              sx={{
                py: 1.5, justifyContent: 'flex-start', px: 2.5, borderRadius: '12px',
                border: `1px dashed ${C.line}`, color: C.text, fontWeight: 600, textTransform: 'none',
                '&:hover': {  border: `1px solid ${C.text}` }
              }}
            >
              🔗 Thêm liên kết (Google Docs, Sheets...)
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button onClick={() => setChoiceModalOpen(false)} sx={outlineBtnSx}>
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL 2: NHẬP LINK GOOGLE DOCS / SHEETS */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={linkModalOpen}
        onClose={() => !isAddingLink && setLinkModalOpen(false)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(460px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 3 }}>
            Thêm liên kết tài liệu
          </Typography>

          <form onSubmit={handleSubmitLink}>
            <Stack spacing={2}>
              {/* Ô nhập tên tài liệu */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25,
                  borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
                  '&:focus-within': { border: `1px solid ${C.text}` }
                }}
              >
                <TypeBadge type="txt" />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Tên tài liệu (không bắt buộc, bỏ trống sẽ tự lấy tên)..."
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  InputProps={{ disableUnderline: true, sx: { fontSize: 14, fontWeight: 500 } }}
                />
              </Box>

              {/* Ô nhập đường dẫn URL */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25,
                  borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
                  '&:focus-within': { border: `1px solid ${C.text}` }
                }}
              >
                <LinkIcon />
                <TextField
                  fullWidth
                  autoFocus
                  variant="standard"
                  placeholder="Dán đường dẫn (https://docs.google.com/...)..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  InputProps={{ disableUnderline: true, sx: { fontSize: 14, fontWeight: 500 } }}
                />
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button onClick={() => setLinkModalOpen(false)} disabled={isAddingLink} sx={outlineBtnSx}>Hủy</Button>
              <Button
                type="submit"
                disabled={!linkUrl.trim() || isAddingLink}
                sx={{ ...darkBtnSx, '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub } }}
              >
                {isAddingLink ? 'Đang thêm...' : 'Thêm liên kết'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* MODAL ĐỔI TÊN */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={Boolean(renameTarget)}
        onClose={() => !isRenaming && setRenameTarget(null)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 3 }}>
            {renameTarget?.kind === 'FOLDER' ? 'Đổi tên thư mục' : 'Đổi tên tệp tin'}
          </Typography>

          <form onSubmit={handleConfirmRename}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25,
                borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
                '&:focus-within': { border: `1px solid ${C.text}` }
              }}
            >
              <TypeBadge type={renameTarget?.kind === 'FOLDER' ? 'folder' : getTypeKey(renameTarget?.item, false)} />
              <TextField
                fullWidth
                autoFocus
                variant="standard"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: 14, fontWeight: 500 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
              <Button onClick={() => setRenameTarget(null)} disabled={isRenaming} sx={outlineBtnSx}>Hủy</Button>
              <Button
                type="submit"
                disabled={!newName.trim() || isRenaming}
                sx={{ ...darkBtnSx, '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub } }}
              >
                Lưu
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* MODAL XÁC NHẬN XÓA */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 1.5 }}>
            {deleteTarget?.kind === 'FOLDER' ? 'Xóa thư mục' : 'Xóa tệp tin'}
          </Typography>

          <Typography sx={{ fontSize: 14, color: C.textSub, lineHeight: 1.7, mb: 3, fontWeight: 300 }}>
            Bạn có chắc muốn xóa <b style={{ color: C.text }}>{deleteTarget?.item?.name}</b>
            {deleteTarget?.kind === 'FOLDER' && deleteTarget.item.fileCount > 0
              ? ` cùng ${deleteTarget.item.fileCount} tệp bên trong (${deleteTarget.item.storeSize})`
              : ''}
            ?{deleteTarget?.kind === 'FOLDER' ? ' Thư mục con cũng bị xóa theo.' : ''} Hành động này không thể khôi phục.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting} sx={outlineBtnSx}>
              Hủy
            </Button>
            <Button onClick={handleConfirmDelete} disabled={isDeleting} sx={dangerBtnSx}>
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL CHIA SẺ LINK */}
      <Modal
        disableScrollLock
        disableRestoreFocus
        open={Boolean(shareLinkModal)}
        onClose={() => setShareLinkModal(null)}
        BackdropProps={{ sx: modalBackdropSx }}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(480px, 92vw)' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 0.5 }}>
            Chia sẻ thư mục
          </Typography>
          <Typography sx={{ fontSize: 14, color: C.textSub, mb: 3 }}>
            Bất kỳ ai có liên kết này đều xem được nội dung thư mục.
          </Typography>

          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, p: 1.25, pl: 1.5,
              borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
              '&:hover': { bgcolor: C.fieldBg },
              '&:focus-within': { border: `1px solid ${C.text}`, bgcolor: C.fieldBg }
            }}
          >
            <Box component="span" sx={{ display: 'inline-flex', color: C.textSub }}>
              <LinkIcon />
            </Box>
            <TextField
              fullWidth
              variant="standard"
              value={shareLinkModal || ''}
              onFocus={(e) => e.target.select()}
              InputProps={{ readOnly: true, disableUnderline: true, sx: { fontSize: 14, fontWeight: 500 } }}
            />
            <IconButton
              size="small"
              title="Sao chép"
              onClick={handleCopyShareLink}
              sx={{ color: C.textSub, '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.16)' } }}
            >
              <CopyIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
            <Button onClick={() => setShareLinkModal(null)} sx={outlineBtnSx}>Đóng</Button>
            <Button onClick={handleCopyShareLink} sx={darkBtnSx}>Sao chép liên kết</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};