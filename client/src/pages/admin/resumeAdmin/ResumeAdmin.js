import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
  StyleButton, StyleTyp,
} from '../../../components/admin/homepage';

function ResumeAdmin() {
  return (
    <>
      <SectionHeader
        title={<StyleTyp>Resume</StyleTyp>}
        action={<StyleButton>Thêm +</StyleButton>}
      />
    </>
  );
}

export default ResumeAdmin;