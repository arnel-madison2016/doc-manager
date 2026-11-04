import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/Button';
import { User, Trash2, Upload } from 'lucide-react';

export default function AvatarUploader({ currentAvatar }) {
    const { t } = useTranslation();
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        avatar: null,
    });

    // État local pour stocker l'URL temporaire de l'aperçu
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file)); // Génère l'aperçu immédiat
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.avatar.update'), {
            onSuccess: () => {
                reset('avatar');
                setPreview(null); // Nettoie l'aperçu temporaire après succès
            },
        });
    };

    // Priorité à l'aperçu local, sinon l'avatar actuel de la base
    const avatarSrc = preview || currentAvatar;

    return (
        <div className="flex items-center space-x-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-alt border border-border flex items-center justify-center shrink-0">
                {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-10 h-10 text-ink-muted" />
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                    <label className="cursor-pointer">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-surface text-ink border border-border hover:bg-surface-alt transition-colors">
                            <Upload className="w-3.5 h-3.5 mr-1.5 text-primary-600" />
                            {t('profile.avatar.select', 'Selectionnez')}
                        </span>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {data.avatar && (
                        <Button type="submit" size="sm" disabled={processing}>
                            {t('common.save', 'Changer')}
                        </Button>
                    )}

                    {currentAvatar && !data.avatar && (
                        <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => {
                                setPreview(null);
                                destroy(route('profile.avatar.destroy'));
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            {t('common.delete', 'Supprimer')}
                        </Button>
                    )}
                </div>
                {errors.avatar && <p className="text-xs text-danger">{errors.avatar}</p>}
            </form>
        </div>
    );
}