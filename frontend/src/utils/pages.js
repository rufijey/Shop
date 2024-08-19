
export const getPagesCount = (totalPages, per_page) =>{
    return Math.ceil(totalPages / per_page);
}