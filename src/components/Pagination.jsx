import { TablePagination } from '@mui/material'
import React from 'react'

const Pagination = ({page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, count}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component='div'
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  )
}

export default Pagination
