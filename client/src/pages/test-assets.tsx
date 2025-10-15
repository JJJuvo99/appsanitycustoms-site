import mobileImage from "@assets/mobile-375x812.png";
import hoverGetInTouch from "@assets/hover-get-in-touch.png";
import afterClickViewWork from "@assets/after-click-view-work.png";
import scrollIndicator from "@assets/scroll-indicator.png";
import afterClickGetInTouch from "@assets/after-click-get-in-touch.png";
import afterClickNavHome from "@assets/after-click-nav-home.png";
import hoverViewWork from "@assets/hover-view-work.png";

export default function TestAssets() {
  const assets = [
    { name: "Mobile View (375x812)", src: mobileImage, id: "mobile" },
    { name: "Hover - Get in Touch", src: hoverGetInTouch, id: "hover-get-in-touch" },
    { name: "Hover - View Work", src: hoverViewWork, id: "hover-view-work" },
    { name: "After Click - Get in Touch", src: afterClickGetInTouch, id: "after-click-get-in-touch" },
    { name: "After Click - View Work", src: afterClickViewWork, id: "after-click-view-work" },
    { name: "After Click - Nav Home", src: afterClickNavHome, id: "after-click-nav-home" },
    { name: "Scroll Indicator", src: scrollIndicator, id: "scroll-indicator" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient mb-8" data-testid="test-assets-title">
          Asset Import Test
        </h1>
        <p className="text-muted-foreground mb-8" data-testid="test-assets-description">
          Testing that all PNG assets from attached_assets folder can be imported using @assets alias
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-border rounded-lg p-4" data-testid={`asset-card-${asset.id}`}>
              <h3 className="text-lg font-semibold mb-4" data-testid={`asset-name-${asset.id}`}>
                {asset.name}
              </h3>
              <img 
                src={asset.src} 
                alt={asset.name} 
                className="w-full rounded border border-border"
                data-testid={`asset-image-${asset.id}`}
              />
              <p className="text-sm text-muted-foreground mt-2" data-testid={`asset-path-${asset.id}`}>
                Path: @assets/{asset.id}.png
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg" data-testid="test-result">
          <h2 className="text-xl font-semibold mb-2">✅ Test Result</h2>
          <p className="text-muted-foreground">
            If you can see all {assets.length} images above, the @assets alias is working correctly!
          </p>
        </div>
      </div>
    </div>
  );
}
