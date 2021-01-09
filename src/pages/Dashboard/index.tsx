import React, { useState, useEffect } from 'react';
import moment from 'moment'
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      let response = await api.get("/transactions");

      response.data.transactions.map((item: Transaction) =>{
        var date= new Date(item.created_at.substring(0,10))

        item.formattedDate=`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      })

      setTransactions(response.data.transactions);

      setBalance(response.data.balance)
      console.log(response.data.balance);
    }

    loadTransactions();
  }, []);

  function formateValue(value: string){
    let formattedValue = new Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(Number(value))
    return formattedValue
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formateValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formateValue(balance.outcome)}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formateValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&

                transactions.map(item => (
                  <tr>
                    <td className="title">{item.title}</td>

                    {item.type =='income'?
                    <>
                    <td className="income">{formateValue(item.value.toString())}</td>
                    <td className="income"> income</td>
                    </>
                    :
                    <>
                    <td className="outcome">- {formateValue(item.value.toString())}</td>
                    <td className="outcome"> outcome</td>
                    </>
                  }
                    <td>{item.category.title}</td>
                    <td>{               
                    item.formattedDate
                    }</td>
                  </tr>
                ))

              }

            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
