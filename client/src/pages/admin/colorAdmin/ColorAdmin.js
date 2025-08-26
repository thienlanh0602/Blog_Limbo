import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
  StyleButton, StyleTyp,
} from '../../../components/admin/homepage';

function ColorAdmin() {
  return (
    <>
      <SectionHeader
        title={<StyleTyp>Color</StyleTyp>}
        action={<StyleButton>Thêm +</StyleButton>}
      />
    </>
  );
}

export default ColorAdmin;