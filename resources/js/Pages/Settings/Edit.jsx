import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import PreferencesForm from '../../Components/profile/PreferencesForm';

// Paramètres personnels : thème, langue, lignes par page, vue des documents.
export default function Edit({ preferences = {} }) {
    const { t } = useTranslation();
    return (
        <AppLayout title={t('user.settings', 'Mes paramètres')}>
            <div className="mx-auto max-w-3xl">
                <PreferencesForm preferences={preferences} />
            </div>
        </AppLayout>
    );
}
