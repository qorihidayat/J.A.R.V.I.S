function getDate() {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}
module.exports = {
    getDate
};