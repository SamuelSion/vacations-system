import { describe, expect, it } from "vitest";
import { formUtil } from "./form-util";

describe("FormUtil", () => {

    it("should exist", () => {
        expect(formUtil).toBeTruthy();
    });

    it("should copy text fields into FormData", () => {
        const formData = formUtil.toFormData({ destination: "Paris", price: "1450" });
        expect(formData.get("destination")).toBe("Paris");
        expect(formData.get("price")).toBe("1450");
    });

    it("should skip null fields", () => {
        const formData = formUtil.toFormData({ destination: "Paris", image: null });
        expect(formData.has("image")).toBe(false);
    });

    it("should include a file field", () => {
        const image = new File(["fake-image-content"], "paris.jpg", { type: "image/jpeg" });
        const formData = formUtil.toFormData({ destination: "Paris", image });
        const sentImage = formData.get("image") as File;
        expect(sentImage.name).toBe("paris.jpg");
    });

});
