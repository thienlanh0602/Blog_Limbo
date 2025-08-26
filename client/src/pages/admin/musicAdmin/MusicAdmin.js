import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
  StyleButton, StyleTyp,
} from '../../../components/admin/homepage';


function MusicAdmin() {
  return (
    <>
      <SectionHeader
        title={<StyleTyp>Music</StyleTyp>}
        action={<StyleButton>Thêm +</StyleButton>}
      />
    </>

  );
}

export default MusicAdmin;