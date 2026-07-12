function getDate() {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    })
}
module.exports = {
    getDate
};