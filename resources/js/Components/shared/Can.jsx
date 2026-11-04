import { useCan } from '../../lib/can';

// Affiche ses enfants uniquement si l'utilisateur possède la permission Spatie demandée.
// Garde purement visuelle : l'autorisation réelle reste appliquée côté serveur.
export default function Can({ perm, fallback = null, children }) {
    const can = useCan();
    return can(perm) ? children : fallback;
}
