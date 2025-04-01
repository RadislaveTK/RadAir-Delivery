import React from 'react'
import Header from '../components/Header'
import BackBtn from '../components/BackBtn'

export default function NotFound() {
  
  return <>
    <Header />
    <main>
      <BackBtn />
      <h1 style={{textAlign: "center", fontWeight: 700, color:"#963736"}}>404<br />Не найдено</h1>
    </main>
  </>
}
