import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import AvatarUploader from '../../Components/shared/AvatarUploader';
import Card from '../../Components/ui/Card';
import DangerZone from '../../Components/profile/DangerZone';
import DevicesList from '../../Components/profile/DevicesList';
import {PasswordForm} from '../../Components/profile/PasswordForm';
import ProfileForm from '../../Components/profile/ProfileForm';

// Mon profil (§4.1 du Cahier des charges) : informations, photo, mot de passe, appareils, droits RGPD.
export default function Edit({ profile, tokens = [], isLastAdmin = false }) {
    const { t } = useTranslation();

    return (
        <AppLayout title={t('profile.title', 'Paramètres Personnels')}>
            <div className="mx-auto max-w-3xl space-y-6">
                <Card title={t('profile.avatar.title', 'Photo de profil')}>
                    <AvatarUploader user={profile} />
                </Card>
                <ProfileForm profile={profile} />
                <PasswordForm />
                <DevicesList tokens={tokens} />
                <DangerZone isLastAdmin={isLastAdmin} />
            </div>
        </AppLayout>
    );
}
