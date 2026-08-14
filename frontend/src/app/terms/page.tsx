'use client'

export const dynamic = 'force-dynamic'

import { useSettings } from '@/hooks/useSettings'

export default function TermsPage() {
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Conditions Générales de Vente</h1>
          <p className="text-blue-100">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </section>

      <section className="container py-12 prose prose-lg max-w-4xl">
        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales de Vente régissent les relations entre {settings?.businessName || 'GLA GLA Business'} 
          et ses clients dans le cadre de la vente de produits sur le site.
        </p>

        <h2>2. Produits</h2>
        <p>
          Les produits proposés sont décrits avec la plus grande exactitude. Les photos sont non contractuelles.
          Nous nous réservons le droit de modifier la gamme de produits à tout moment.
        </p>

        <h2>3. Prix</h2>
        <p>
          Les prix sont indiqués en Francs CFA (FCFA), toutes taxes comprises. Les frais de livraison 
          sont indiqués séparément lors de la commande.
        </p>

        <h2>4. Commande</h2>
        <p>
          La validation de la commande vaut acceptation des présentes conditions. La commande est 
          confirmée après validation sur WhatsApp avec notre équipe.
        </p>

        <h2>5. Paiement</h2>
        <p>
          Le paiement s'effectue à la livraison (cash, Orange Money, MTN Mobile Money) ou par virement bancaire.
          Le produit reste la propriété du vendeur jusqu'au paiement intégral.
        </p>

        <h2>6. Livraison</h2>
        <p>
          Les délais de livraison sont indiqués à titre indicatif. En cas de retard, nous nous engageons 
          à vous en informer dans les plus brefs délais.
        </p>

        <h2>7. Droit de rétractation</h2>
        <p>
          Conformément à la loi, vous disposez d'un délai de 7 jours pour retourner un produit 
          non utilisé et dans son emballage d'origine.
        </p>

        <h2>8. Garantie</h2>
        <p>
          Les produits sont garantis contre tout défaut de fabrication. La garantie est valable 
          selon les conditions du fabricant.
        </p>

        <h2>9. Données personnelles</h2>
        <p>
          Vos données personnelles sont traitées conformément à notre politique de confidentialité. 
          Elles ne sont pas partagées avec des tiers sans votre consentement.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pour toute question relative aux CGV, contactez-nous via WhatsApp ou par email.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mt-8">
          <p className="text-sm text-gray-500 mb-0">
            {settings?.businessName || 'GLA GLA Business'} - {settings?.businessAddress || 'Yaoundé, Cameroun'}
            <br />
            {settings?.businessPhone || '+237 600 000 000'} - {settings?.businessEmail || 'contact@glagla.com'}
          </p>
        </div>
      </section>
    </div>
  )
}
