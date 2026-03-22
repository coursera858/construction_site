
export const paginationObject = (totalDocuments,page,limit) =>{
    const totalPages = Math.ceil(totalDocuments/limit)

    return {
        totalDocuments : totalDocuments,
        totalPages : totalPages,
        currentPage : page,
        hasNextPage : page < totalPages,
        hasPrevPage : page > 1
    }
}