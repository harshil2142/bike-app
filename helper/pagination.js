exports.paginatedArray = (array, size, page) => {
    const startIndex = (page && size) ? ((+page - 1) * +size) : 0;
    const endIndex = size ? startIndex + +size : array.length;
    const totalPages = Math.ceil(array?.length / +size);
    const docs = array?.slice(startIndex, endIndex);
    return {
      data: docs,
      pagination: {
        totalItems: array?.length,
        totalPages: totalPages,
        currentPage: +page,
        pageSize: +size
      }
    }
  }