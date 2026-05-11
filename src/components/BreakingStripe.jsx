import { memo } from "react"

const BREAKING_TEXT = [
    "विधानसभा निवडणूक निकाल जाहीर",
    "सरकार स्थापनेच्या हालचालींना वेग",
    "मुंबईत जोरदार पाऊस"
]

const BreakingStrip = () => {
    return (
        <div className="h-10 bg-(--color-breaking) text-white flex items-center px-4 overflow-hidden gap-3">
            <span className="text-[11px] font-extrabold tracking-[0.08em] px-2 py-0.75 bg-white/20 rounded-[3px] shrink-0">
                BREAKING
            </span>

            <span className="mr text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">
                {BREAKING_TEXT.map((text, index) => (
                    <span key={index}>
                        {text}
                        {index < BREAKING_TEXT.length - 1 && " | "}
                    </span>
                ))}
            </span>
        </div>
    )
}

export default memo(BreakingStrip)