import React,{useEffect,useState} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import store from '../../store';
import {HandleGetUserDetails,HandleInitiatePayment} from '../../action';
import  {connect} from 'react-redux'
// import Title from './Title';



const rows = [];



const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const  Index = ({user,payments,error_message,success_message}) =>{
  const classes = useStyles();
  const [amount, setAmount] = useState(0)

  useEffect(()=>{
    store.dispatch(HandleGetUserDetails())
  },[])

  const submitForm=(e)=>{
    e.preventDefault();

    let data = {amount};

    store.dispatch(HandleInitiatePayment(data))
  }




  return (
    <React.Fragment>
      <p>{user ? user.email : null}</p>
      <input  onChange={(e)=>setAmount(e.target.value)} type="number" />
      <button onClick={e=>submitForm(e)} >Button</button>
      {/* <Title>Recent Orders</Title> */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
            {error_message && error_message.type === 'initiate-payment-fail' ? error_message.info : null}


            {success_message && success_message.type === 'inititate-payment-success' ? success_message.info : null}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps =({data:{user,payments,error_message,success_message}})=>({
  payments,user,success_message,error_message
})

export default  connect(mapStateToProps, null)(Index);