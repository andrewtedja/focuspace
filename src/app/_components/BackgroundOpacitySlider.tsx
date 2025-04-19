import { Slider } from "~/components/ui/slider";
import { useWidgetManager } from "~/lib/widget-manager-context";

const BackgroundOpacitySlider = () => {
  const { currentPageId, pages, updatePageBackground } = useWidgetManager();
  const currentPage = pages.find((p) => p.id === currentPageId);

  return (
    <div className="px-3 py-4">
      <span className="mb-1 block text-xs text-gray-600">
        Background Opacity
      </span>
      <Slider
        min={0}
        max={100}
        defaultValue={[
          currentPage?.backgroundOverlayOpacity
            ? currentPage.backgroundOverlayOpacity * 100
            : 0,
        ]}
        onValueChange={(value) => {
          updatePageBackground(
            currentPageId,
            currentPage?.backgroundImage ?? "",
            value[0] ? value[0] / 100 : 0,
          );
        }}
      />
    </div>
  );
};

export default BackgroundOpacitySlider;
