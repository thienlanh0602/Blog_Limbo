import React from 'react';
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
  Popover
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
import { addMonths, getDownloadUrl, getTypeKey } from '../utils/driveHelpers';


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

  C
}) => {
  return (
    <>
      {/* MODAL CHỌN NGÀY */}
      <Modal
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(2px) !important',
            WebkitBackdropFilter: 'blur(2px) !important',
            bgcolor: 'rgba(123, 136, 149, 0.3)'
          }
        }}
        disableScrollLock open={isDateOpen} onClose={() => setIsDateOpen(false)}>
        <Box sx={{ ...modalBoxSx, width: 'min(860px, 94vw)', maxHeight: '92vh', overflowY: 'auto', p: 3 }}>
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
          <MenuItem key="download" sx={menuItemSx} component="a" href={getDownloadUrl(menu.target.url)} download target="_blank" rel="noreferrer" onClick={handleCloseMenu}>
            <DownloadIcon /> Tải xuống
          </MenuItem>,
          isAdmin && <Divider key="divider-file" sx={{ borderStyle: 'dashed', my: '2px !important' }} />,
          isAdmin && (
            <MenuItem key="delete-file" sx={menuItemDangerSx} onClick={() => handleAskDelete('FILE', menu.target)}>
              <TrashIcon /> Xóa tệp tin
            </MenuItem>
          )
        ]}
      </Menu>

      {/* MODAL XEM THỬ FILE */}
      <Modal disableScrollLock open={Boolean(selectedPreview)} onClose={() => setSelectedPreview(null)}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(2px) !important',
            WebkitBackdropFilter: 'blur(2px) !important',
            bgcolor: 'rgba(123, 136, 149, 0.3)'
          }
        }}>
        <Box sx={{ ...dialogBoxSx, maxWidth: '800px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}>
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
            <Box sx={{ py: 4, px: 2 }}>
              <Typography sx={{ fontSize: 14, color: C.textSub, mb: 1 }}>
                Không hỗ trợ xem trực tiếp tất cả các tệp vì credit không cho phép, tải xuống mà xem.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, pt: 2, borderTop: `1px dashed ${C.line}` }}>
            <Button onClick={() => setSelectedPreview(null)} sx={outlineBtnSx}>
              Đóng
            </Button>
            <Button
              component="a"
              href={getDownloadUrl(selectedPreview?.url)}
              download
              target="_blank"
              rel="noreferrer"
              sx={darkBtnSx}
            >
              Tải xuống
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL TẠO THƯ MỤC */}
      <Modal disableScrollLock disableRestoreFocus open={isCreateFolderOpen} onClose={handleCloseCreateFolder}>
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

      {/* MODAL ĐỔI TÊN */}
      <Modal disableScrollLock disableRestoreFocus open={Boolean(renameTarget)} onClose={() => !isRenaming && setRenameTarget(null)}>
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
      <Modal disableScrollLock disableRestoreFocus open={Boolean(shareLinkModal)} onClose={() => setShareLinkModal(null)}>
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