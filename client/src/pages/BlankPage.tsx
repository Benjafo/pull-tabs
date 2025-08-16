import { OceanBackground } from "../components/ui/OceanBackground";

export function BlankPage() {
    return (
        <div className="relative min-h-[600px]">
            <OceanBackground variant="waves" intensity="subtle" />
        </div>
    );
}