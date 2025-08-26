import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
  StyleButton, StyleTyp,
} from '../../../components/admin/homepage';

function ImageAdmin() {
  return (
    <>
      <SectionHeader
        title={<StyleTyp>Image</StyleTyp>}
        action={<StyleButton>Thêm +</StyleButton>}
      />
    </>
  );
}

export default ImageAdmin;