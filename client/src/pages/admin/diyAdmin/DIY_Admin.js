import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
  StyleButton, StyleTyp,
} from '../../../components/admin/homepage';
function DIYAdmin() {
  return (
    <>
      <SectionHeader
        title={<StyleTyp>DIY</StyleTyp>}
        action={<StyleButton>Thêm +</StyleButton>}
      />
    </>

  );
}

export default DIYAdmin;