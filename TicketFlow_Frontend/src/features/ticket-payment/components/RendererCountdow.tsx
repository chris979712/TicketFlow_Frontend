import {type CountdownRenderProps} from 'react-countdown';

export function RendererCountdown({minutes , seconds}: CountdownRenderProps){
    return (
        <section className="tp-countdown-container">
            <p className="tp-countdown-label">Tiempo restante para completar tu compra</p>
            <div className="tp-countdown-timer">
                <span className="tp-countdown-time">{String(minutes).padStart(2, '0')}</span>
                <span className="tp-countdown-separator">:</span>
                <span className="tp-countdown-time">{String(seconds).padStart(2, '0')}</span>
            </div>
        </section>
    )
}