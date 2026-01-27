import StripBanner from "@/components/strips/StripBanner";
import StripStory from "@/components/strips/StripsStory";
import SvgLayout from "@/components/strips/SvgLayout";
import CustomCursor from "@/utils/CustomCursor";

export default function Strips() {
    return (
        <>
        <CustomCursor />
        <div className="relative z-10 bg-cream">
            <SvgLayout />
            <StripBanner />
            <StripStory />
        </div>
        </>
    )
}