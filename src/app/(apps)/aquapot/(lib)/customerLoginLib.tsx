export const getAqLoginType = ({session}) => {
  const {customerNumber, email} = session
  const asCustomer = customerNumber && email
  const asUser = session && !asCustomer
  return {asCustomer, asUser}
}
