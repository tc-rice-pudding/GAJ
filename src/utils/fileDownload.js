export const fileDownload = (data, fileName, isTransformBlob) => {
    const el = document.createElement('a');
    el.download = `${fileName}`;
    el.style.display = 'none';
    let urlBlob = null;
    if (isTransformBlob) {
        const blob = new Blob([data]);
        urlBlob = URL.createObjectURL(blob);
    } else {
        urlBlob = URL.createObjectURL(data);
    }
    el.href = urlBlob;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    URL.revokeObjectURL(urlBlob);
};