import {type CountdownRenderProps} from 'react-countdown';

export function RendererCountdown({minutes , seconds}: CountdownRenderProps){
    return (
        <section className="countdown-container">
            <p className="countdown-label">Tiempo restante para completar tu compra</p>
            <div className="countdown-timer">
                <span className="countdown-time">{String(minutes).padStart(2, '0')}</span>
                <span className="countdown-separator">:</span>
                <span className="countdown-time">{String(seconds).padStart(2, '0')}</span>
            </div>
        </section>
    )
}