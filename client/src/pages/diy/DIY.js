import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  getDriveContents,
  createFolder,
  uploadDriveFile,
  shareFolder,
  deleteDriveFile,
  deleteDriveFolder,
  renameDriveFolder,
  renameDriveFile,
  createLinkFile
} from '../../api/driveAPI';

import { TopBlur } from './components/TopBlur';
import { DriveErrorView } from './components/DriveErrorView';
import { DriveHeader } from './components/DriveHeader';
import { DriveBreadcrumbs } from './components/DriveBreadcrumbs';
import { DriveFilters } from './components/DriveFilters';
import { DriveItemList } from './components/DriveItemList';
import { DriveModals } from './components/DriveModals';
import { DriveToast } from './components/DriveToast';

import {
  formatDate,
  getTypeKey,
  startOfDay,
  endOfDay,
  startOfMonth,
  addMonths,
  isSameDay,
  saveStarred
} from './utils/driveHelpers';

/* ---------- Design tokens (theo Minimals) ---------- */
const C = {
  text: '#1C252E',
  textSub: '#637381',
  line: 'rgba(145, 158, 171, 0.2)',
  fieldBg: 'rgba(145, 158, 171, 0.08)',
  danger: '#B71D18',
  dangerBg: 'rgba(255, 86, 48, 0.08)',
  errorMain: '#FF5630',
  successMain: '#22C55E'
};

const STARRED_KEY = 'drive_starred_folders';

const menuPaperSx = {
  mt: 0.5, p: 0.5, minWidth: 190, borderRadius: '10px', backgroundImage: 'none',
  boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
};
const menuItemSx = {
  gap: 2, px: 1, minHeight: 36, borderRadius: '6px',
  fontSize: 14, fontWeight: 500, color: C.text,
  '& svg': { flexShrink: 0 },
  '&:hover': { bgcolor: C.fieldBg }
};
const menuItemDangerSx = {
  ...menuItemSx,
  color: C.danger,
  '&:hover': { bgcolor: C.dangerBg }
};

const modalBoxSx = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper', boxShadow: 0, p: 4, borderRadius: 2
};

const dialogBoxSx = {
  ...modalBoxSx, p: 3, borderRadius: '16px',
  boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
};

const keepBtnVisible = (bg, hoverBg, color) => ({
  opacity: 1,
  visibility: 'visible',
  '&:focus, &:focus-visible, &:active': { bgcolor: bg, color, outline: 'none', opacity: 1, visibility: 'visible' },
  '&:hover, &:hover:focus, &:hover:active': { bgcolor: hoverBg, color }
});

const headerBtnSx = {
  flexShrink: 0, height: 40, px: { xs: 1.5, sm: 2 }, minWidth: { xs: 40, sm: 'auto' }, width: { xs: 40, sm: 'auto' }, borderRadius: '8px', textTransform: 'none',
  fontWeight: 700, fontSize: 14,
  bgcolor: C.text, color: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  '& .MuiButton-startIcon': { margin: { xs: 0, sm: '0 8px 0 -4px' } },
  ...keepBtnVisible(C.text, '#454F5B', '#fff'),
  '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub }
};

const FILTER_TYPES = [
  { key: 'folder', label: 'Thư mục' },
  { key: 'txt', label: 'Txt' },
  { key: 'zip', label: 'Zip' },
  { key: 'audio', label: 'Âm thanh' },
  { key: 'image', label: 'Hình ảnh' },
  { key: 'video', label: 'Video' },
  { key: 'word', label: 'Word' },
  { key: 'excel', label: 'Excel' },
  { key: 'powerpoint', label: 'Powerpoint' },
  { key: 'pdf', label: 'Pdf' },
  { key: 'photoshop', label: 'Photoshop' },
  { key: 'illustrator', label: 'Illustrator' }
];

const outlineBtnSx = {
  height: 36, px: 2, borderRadius: '8px', textTransform: 'none',
  fontWeight: 700, fontSize: 14,
  color: C.text, border: `1px solid ${C.line}`, bgcolor: '#fff',
  ...keepBtnVisible('#fff', C.fieldBg, C.text)
};
const darkBtnSx = {
  height: 36, px: 2, borderRadius: '8px', textTransform: 'none',
  fontWeight: 600, fontSize: 14,
  bgcolor: C.text, color: '#fff', boxShadow: 'none',
  ...keepBtnVisible(C.text, '#454F5B', '#fff'),
  '&:hover': { boxShadow: 'none' }
};
const dangerBtnSx = {
  ...darkBtnSx,
  bgcolor: C.errorMain,
  ...keepBtnVisible(C.errorMain, C.danger, '#fff'),
  '&.Mui-disabled': { bgcolor: C.dangerBg, color: C.danger }
};

const DrivePage = () => {
  const [items, setItems] = useState({ folders: [], files: [], role: '' });
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [menu, setMenu] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadState, setUploadState] = useState(null);
  
  // State quản lý hiển thị Modal lựa chọn hình thức upload
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);

  const [starredIds, setStarredIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STARRED_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareLinkModal, setShareLinkModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
  const toastTimer = useRef(null);

  const [renameTarget, setRenameTarget] = useState(null);
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // XU LY RENAME FOLDER N FILE
  const handleAskRename = (kind, item) => {
    handleCloseMenu();
    setRenameTarget({ kind, item });
    setNewName(item.name);
  };

  const handleConfirmRename = async (e) => {
    e.preventDefault();
    if (!renameTarget || !newName.trim()) return;

    const { kind, item } = renameTarget;
    if (newName.trim() === item.name) {
      setRenameTarget(null);
      return;
    }

    setIsRenaming(true);
    try {
      if (kind === 'FOLDER') {
        await renameDriveFolder(item._id, newName.trim());
      } else {
        await renameDriveFile(item._id, newName.trim());
      }

      setRenameTarget(null);
      loadData(currentFolderId);
      showToast(kind === 'FOLDER' ? 'Đã đổi tên thư mục' : 'Đã đổi tên tệp tin');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Đổi tên thất bại!';
      showToast(errorMsg, 'error');
    } finally {
      setIsRenaming(false);
    }
  };

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ open: true, type, message });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, open: false })),
      type === 'error' ? 5000 : 3000
    );
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [draftRange, setDraftRange] = useState({ start: null, end: null });
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => startOfMonth(new Date()));
  const [rightMonth, setRightMonth] = useState(() => addMonths(new Date(), 1));
  const [typeFilter, setTypeFilter] = useState([]);
  const [draftTypes, setDraftTypes] = useState([]);
  const [typeAnchor, setTypeAnchor] = useState(null);

  const handleOpenDate = () => {
    setDraftRange(dateRange);
    const base = dateRange.start ? startOfMonth(dateRange.start) : startOfMonth(new Date());
    setLeftMonth(base);
    setRightMonth(addMonths(base, 1));
    setIsDateOpen(true);
  };

  const handlePickDay = (d) => {
    setDraftRange(({ start, end }) => {
      if (!start || end) return { start: d, end: null };
      if (startOfDay(d) < startOfDay(start)) return { start: d, end: start };
      return { start, end: d };
    });
  };

  const handleApplyDate = () => {
    const { start } = draftRange;
    const end = draftRange.end || start;
    setDateRange(start ? { start, end } : { start: null, end: null });
    setIsDateOpen(false);
  };

  const handleOpenType = (e) => {
    setDraftTypes(typeFilter);
    setTypeAnchor(e.currentTarget);
  };
  const toggleDraftType = (key) =>
    setDraftTypes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const handleApplyType = () => {
    setTypeFilter(draftTypes);
    setTypeAnchor(null);
  };

  const queryParams = new URLSearchParams(window.location.search);
  const shareToken = queryParams.get('shareToken');
  const isAdmin = items.role === 'ADMIN';
  const isUploading = Boolean(uploadState);
  const rootName = shareToken ? (items.shareRoot?.name || 'Thư mục chia sẻ') : 'Folder';

  const loadData = async (folderId = null) => {
    try {
      setError('');
      const data = await getDriveContents(folderId, shareToken);
      setItems(data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Đã có lỗi');
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu Drive');
      }
    }
  };

  useEffect(() => {
    setSearch('');
    loadData(currentFolderId);
  }, [currentFolderId]);

  const handleOpenMenu = (e, type, target) => {
    e.stopPropagation();
    if (type === 'FOLDER' && !isAdmin) return;
    setMenu({ anchorEl: e.currentTarget, type, target });
  };

  const handleCloseMenu = () => setMenu((m) => (m ? { ...m, anchorEl: null } : m));

  const toggleStar = (e, id) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveStarred(next);
      return next;
    });
  };

  const handleOpenFolder = (folder) => {
    setFolderHistory([...folderHistory, { id: folder._id, name: folder.name }]);
    setCurrentFolderId(folder._id);
    handleCloseMenu();
  };

  const handleNavigateToIndex = (index) => {
    if (index === -1) {
      setFolderHistory([]);
      setCurrentFolderId(null);
    } else {
      const targetHistory = folderHistory.slice(0, index + 1);
      const targetFolder = targetHistory[targetHistory.length - 1];
      setFolderHistory(targetHistory);
      setCurrentFolderId(targetFolder.id);
    }
  };

  const handleCreateFolderSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName, currentFolderId);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      loadData(currentFolderId);
      showToast('Đã tạo thư mục');
    } catch (err) {
      showToast(err.response?.data?.message || 'Tạo thư mục thất bại!', 'error');
    }
  };

  const handleCloseCreateFolder = () => {
    setIsCreateFolderOpen(false);
    setNewFolderName('');
  };

  const handleFileUpload = async (e) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const failed = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadState({ current: i + 1, total: files.length, percent: 0 });

        const formData = new FormData();
        formData.append('file', files[i]);
        if (currentFolderId) formData.append('folderId', currentFolderId);

        try {
          await uploadDriveFile(formData, (percent) =>
            setUploadState({ current: i + 1, total: files.length, percent })
          );
        } catch (err) {
          failed.push(`${files[i].name}: ${err.response?.data?.message || 'Upload thất bại'}`);
        }
      }
    } finally {
      setUploadState(null);
      input.value = '';
      loadData(currentFolderId);
    }

    if (failed.length > 0) {
      showToast(`Không tải lên được ${failed.length}/${files.length} tệp\n${failed.slice(0, 3).join('\n')}`, 'error');
    } else {
      showToast(`Đã tải lên ${files.length} tệp`);
    }
  };

  // Thêm tệp từ link Google Docs / Sheets / Slides / Forms / Drive (gọi API createLinkFile)
  // Trả về true khi thành công, false khi lỗi: modal nhập link dựa vào đó để đóng lại
  // hoặc giữ nguyên nội dung cho người dùng sửa đường dẫn.
  const handleUploadLink = async ({ url, name }) => {
    try {
      const file = await createLinkFile(url, name, currentFolderId);
      loadData(currentFolderId);
      const label = file?.name || name;
      showToast(label ? `Đã thêm liên kết: ${label}` : 'Đã thêm liên kết');
      return true;
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Không thể thêm liên kết, hãy kiểm tra lại đường dẫn!',
        'error'
      );
      return false;
    }
  };

  const handleAskDelete = (kind, item) => {
    handleCloseMenu();
    setDeleteTarget({ kind, item });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { kind, item } = deleteTarget;
    setIsDeleting(true);
    try {
      if (kind === 'FOLDER') await deleteDriveFolder(item._id);
      else await deleteDriveFile(item._id);

      setStarredIds((prev) => {
        const next = prev.filter((id) => id !== item._id);
        saveStarred(next);
        return next;
      });
      setDeleteTarget(null);
      loadData(currentFolderId);
      showToast(kind === 'FOLDER' ? 'Đã xóa thư mục' : 'Đã xóa tệp tin');
    } catch (err) {
      showToast(
        err.response?.data?.message || (kind === 'FOLDER' ? 'Xóa thư mục thất bại!' : 'Xóa tệp thất bại!'),
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareFolder = async (folderId) => {
    try {
      const res = await shareFolder(folderId);
      const fullLink = `${window.location.origin}${window.location.pathname}?shareToken=${res.shareToken}`;
      setShareLinkModal(fullLink);
      handleCloseMenu();
    } catch {
      showToast('Không thể tạo link chia sẻ!', 'error');
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLinkModal);
      showToast('Đã sao chép liên kết');
    } catch {
      showToast('Không thể sao chép, hãy chọn liên kết và sao chép thủ công', 'error');
    }
  };

  const crumbs = [
    { id: 'root', name: rootName, index: -1 },
    ...folderHistory.map((h, i) => ({ id: h.id, name: h.name, index: i }))
  ];

  const keyword = search.trim().toLowerCase();
  const hasFilter = Boolean(dateRange.start) || typeFilter.length > 0;

  const inDateRange = (value) => {
    if (!dateRange.start) return true;
    const t = new Date(value).getTime();
    if (isNaN(t)) return false;
    return t >= startOfDay(dateRange.start) && t <= endOfDay(dateRange.end || dateRange.start);
  };
  const matchType = (item, isFolder) =>
    typeFilter.length === 0 || typeFilter.includes(getTypeKey(item, isFolder));

  const filteredFolders = (items.folders || []).filter(
    (f) => (!keyword || f.name.toLowerCase().includes(keyword)) && matchType(f, true) && inDateRange(f.createdAt)
  );
  const filteredFiles = (items.files || []).filter(
    (f) => (!keyword || f.name.toLowerCase().includes(keyword)) && matchType(f, false) && inDateRange(f.createdAt)
  );

  const dateLabel = dateRange.start
    ? (isSameDay(dateRange.start, dateRange.end)
      ? formatDate(dateRange.start)
      : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`)
    : 'Chọn ngày';
  const typeLabel = typeFilter.length === 0
    ? 'Tất cả loại'
    : typeFilter.length === 1
      ? FILTER_TYPES.find((t) => t.key === typeFilter[0])?.label
      : `${typeFilter.length} loại`;

  const byStarred = (a, b) =>
    Number(starredIds.includes(b._id)) - Number(starredIds.includes(a._id));
  const visibleFolders = [...filteredFolders].sort(byStarred);
  const visibleFiles = [...filteredFiles].sort(byStarred);

  if (error) {
    return <DriveErrorView />;
  }

  return (
    <Box
      sx={{
        width: '90%',
        textAlign: 'left',
        minHeight: 'calc(100vh - 140px)',
        px: { xs: 2, md: 15 },
        py: 3,
        boxSizing: 'border-box',
        mt: '70px',
        mb: '50px',
        color: C.text
      }}
    >
      <TopBlur />

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <DriveHeader
        isAdmin={isAdmin}
        shareToken={shareToken}
        setIsCreateFolderOpen={setIsCreateFolderOpen}
        isUploading={isUploading}
        uploadState={uploadState}
        headerBtnSx={headerBtnSx}
        C={C}
        setChoiceModalOpen={setChoiceModalOpen}
      />

      {/* Breadcrumbs & Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <DriveBreadcrumbs
          crumbs={crumbs}
          handleNavigateToIndex={handleNavigateToIndex}
          C={C}
        />

        <DriveFilters
          dateLabel={dateLabel}
          dateRange={dateRange}
          handleOpenDate={handleOpenDate}
          typeLabel={typeLabel}
          typeFilter={typeFilter}
          handleOpenType={handleOpenType}
          search={search}
          setSearch={setSearch}
          C={C}
        />
      </Box>

      {/* Items List */}
      <DriveItemList
        visibleFolders={visibleFolders}
        visibleFiles={visibleFiles}
        handleOpenFolder={handleOpenFolder}
        setSelectedPreview={setSelectedPreview}
        isAdmin={isAdmin}
        starredIds={starredIds}
        toggleStar={toggleStar}
        handleOpenMenu={handleOpenMenu}
        keyword={keyword}
        hasFilter={hasFilter}
        C={C}
      />

      {/* Modals & Popovers & Menus */}
      <DriveModals
        isDateOpen={isDateOpen}
        setIsDateOpen={setIsDateOpen}
        leftMonth={leftMonth}
        setLeftMonth={setLeftMonth}
        rightMonth={rightMonth}
        setRightMonth={setRightMonth}
        draftRange={draftRange}
        setDraftRange={setDraftRange}
        handlePickDay={handlePickDay}
        handleApplyDate={handleApplyDate}
        typeAnchor={typeAnchor}
        setTypeAnchor={setTypeAnchor}
        FILTER_TYPES={FILTER_TYPES}
        draftTypes={draftTypes}
        toggleDraftType={toggleDraftType}
        setDraftTypes={setDraftTypes}
        handleApplyType={handleApplyType}
        menu={menu}
        handleCloseMenu={handleCloseMenu}
        menuPaperSx={menuPaperSx}
        menuItemSx={menuItemSx}
        menuItemDangerSx={menuItemDangerSx}
        handleOpenFolder={handleOpenFolder}
        handleShareFolder={handleShareFolder}
        handleAskDelete={handleAskDelete}
        setSelectedPreview={setSelectedPreview}
        isAdmin={isAdmin}
        selectedPreview={selectedPreview}
        dialogBoxSx={dialogBoxSx}
        modalBoxSx={modalBoxSx}
        outlineBtnSx={outlineBtnSx}
        darkBtnSx={darkBtnSx}
        dangerBtnSx={dangerBtnSx}
        isCreateFolderOpen={isCreateFolderOpen}
        handleCloseCreateFolder={handleCloseCreateFolder}
        handleCreateFolderSubmit={handleCreateFolderSubmit}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}

        renameTarget={renameTarget}
        setRenameTarget={setRenameTarget}
        newName={newName}
        setNewName={setNewName}
        isRenaming={isRenaming}
        handleAskRename={handleAskRename}
        handleConfirmRename={handleConfirmRename}

        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
        shareLinkModal={shareLinkModal}
        setShareLinkModal={setShareLinkModal}
        handleCopyShareLink={handleCopyShareLink}
        
        // Props cho Modal lựa chọn Upload & Nhập Link
        choiceModalOpen={choiceModalOpen}
        setChoiceModalOpen={setChoiceModalOpen}
        fileInputRef={fileInputRef}
        onUploadLink={handleUploadLink}

        C={C}
      />

      {/* Toast notification */}
      <DriveToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        C={C}
      />
    </Box>
  );
};

export default DrivePage;