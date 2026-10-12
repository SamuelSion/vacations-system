class FormUtil {

    // Converts a plain object into FormData, so it can be sent as
    // multipart/form-data (needed whenever a file/image is included):
    public toFormData<T extends object>(data: T): FormData {
        const formData = new FormData();

        for (const key of Object.keys(data)) {
            const value = (data as Record<string, unknown>)[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        }

        return formData;
    }

}

export const formUtil = new FormUtil();
