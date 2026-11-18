import { errorExtractor } from "error-extractor";
import iziToast, { IziToastSettings } from "izitoast";
import "izitoast/dist/css/iziToast.css";

class Notify {

    private settings: IziToastSettings = {
        position: "topRight",
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        timeout: 3500
    };

    // Only one message is shown at a time - a new message replaces the one that is still on the screen:
    public success(message: string): void {
        iziToast.destroy();
        this.settings.message = message;
        iziToast.success(this.settings);
    }

    public error(err: unknown): void {
        iziToast.destroy();
        this.settings.message = errorExtractor.getMessage(err);
        iziToast.error(this.settings);
    }

}

export const notify = new Notify();
