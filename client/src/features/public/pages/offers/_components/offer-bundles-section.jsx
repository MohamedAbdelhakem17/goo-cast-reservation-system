import OfferBundleCard from "./offer-bundle-card";
import OfferSectionTitle from "./offer-section-title";

const getBundleId = (bundle) => bundle?._id || bundle?.id;

export default function OfferBundlesSection({
  bundles,
  selectedBundleId,
  onSelectBundle,
  lng,
  t,
}) {
  return (
    <section className="space-y-8 py-2 md:space-y-10">
      <OfferSectionTitle
        title={t("our-bundel", "Our Bundel")}
        info={t(
          "our-bundel-info",
          "Discover the exclusive benefits and features included in our Studio Bundel",
        )}
      />

      <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-10">
        {bundles.map((bundle, index) => (
          <OfferBundleCard
            key={getBundleId(bundle) || index}
            item={bundle}
            index={index}
            lng={lng}
            t={t}
            isSelected={getBundleId(bundle) === selectedBundleId}
            onSelect={onSelectBundle}
          />
        ))}
      </div>
    </section>
  );
}
