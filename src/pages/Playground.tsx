import '../styles/main.css';
import '../styles/variables.css';
import Button from '../components/common/Button';
import SettingsIcon from '../components/icons/Settings';
import SidebarItem from '../components/layout/sidebar/SidebarItem';
import InputString from '../components/common/Input/StringInput';
import InputSearch, { searchQuery } from '../components/common/Input/SearchInput';
import Profile from '../components/common/Profile';
import PadSelect from '../components/misc/intro/PadSelect';
import FileUpload from '../components/common/Input/FileUpload/FileUpload';
import InputCheckbox, { CheckboxOption } from '../components/common/Input/Checkbox';
import NewPassword from '../components/common/Input/NewPassword';
import InputRadio from '../components/common/Input/Radio';
import InputChips from '../components/common/Input/Chips';
import validateEmail from '../functions/validateEmail';
import SmallTable, { Column, SmallTableRef } from '../components/common/Table/Table';
import { useContext, useRef, useState } from 'react';
import SearchContext, { SearchProvider } from '../functions/SearchContext';
import axios from 'axios';
import { useCookie } from '../functions/useCookie';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function PlaygroundPage() {
  const smallTableRef = useRef<SmallTableRef<ReceiptItem>>(null);
  const { getCookie } = useCookie();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const AxiosPost = async () => {
    const response = await fetch("http://localhost:8080/logout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include'
    });

    const status = response.status;
    if(status < 300) {
      navigate("/login")
    }
  }

  const options = [
    { id: "1", label: "A", selected: true },
    { id: "3", label: "B", description: "Hello world!" }, 
    { id: "2", label: "C", },
  ];

  const checkboxOptions: CheckboxOption[] = [
    { id: "1", label: "A", checked: 'i' },
    { id: "2", label: "B", checked: false },
    { id: "3", label: "C", checked: true },
  ]

  const items: ReceiptItem[] = [
  { item: "Booty Vase ‘Aphrodite’", sku: "SSKUUU214", quantity: 3, price: 291.66 },
  { item: "Visage Vase ‘Latte’", sku: "SSKUUU215", quantity: 1, price: 290.66 }
];

interface ReceiptItem {
  item: string;
  sku: string;
  quantity: number;
  price: number;
}

const columns: Column<ReceiptItem>[] = [
  { header: "Item(s)", accessor: "item" },
  { header: "SKU", accessor: "sku" },
  { header: "Quantity", accessor: "quantity", align: "center" },
  {
    header: "Price",
    accessor: (row) => `£${row.price.toFixed(2)}`,
    align: "right"
  }
];

const handleGet = () => {
  console.log(smallTableRef.current?.getSelected())
}

  return (
    <section style={{backgroundColor: "var(--background-content)"}}>
    
    <Button variant='critical' onClick={AxiosPost}>{t('logout.logout')}</Button>

    <SearchProvider>
      <InputSearch label='Search' placeholder="Search by item names, SKU, quantity and price"></InputSearch>
      <SmallTable allowSelection={true} ref={smallTableRef} columns={columns} data={items}></SmallTable>
      <Button onClick={handleGet}>
        Get
      </Button>
    </SearchProvider>


      <div className='playground'>
        <Button>Hello world!</Button>
        <Button icon={<SettingsIcon/>}>Hello world!</Button>
        <Button disabled={true}>Hello world!</Button>
      </div>
      <div className='playground'>
        <Button variant='secondary'>Hello world!</Button>
        <Button icon={<SettingsIcon/>} variant='secondary'>Hello world!</Button>
        <Button variant='secondary' disabled={true}>Hello world!</Button>
      </div>
      <div className='playground'>
        <Button variant='access'>Hello world!</Button>
        <Button icon={<SettingsIcon/>}  variant='access'>Hello world!</Button>
        <Button variant='access' disabled={true}>Hello world!</Button>
      </div>
      <div className='playground'>
        <Button variant='critical'>Hello world!</Button>
        <Button icon={<SettingsIcon/>}  variant='critical'>Hello world!</Button>
        <Button variant='critical' disabled={true}>Hello world!</Button>
      </div>
      <SidebarItem url='www.google.com' icon={<SettingsIcon/>}>Settings</SidebarItem>
      <SidebarItem type={"secondary"} items={[{label: 'Hello world!', url: '/hello-world'}, {label: 'Hello world!', url: '/hello-world'}, {label: 'Hello world!', url: '/hello-world'}]} icon={<SettingsIcon/>}>Settings</SidebarItem>

      <Profile name={["Tatiana", "Yakovleva"]} email="tyakovleva@b9creators.co.uk" picture="/storage/d70ee478ead2fef85d9a86575b6d0315.webp"></Profile>
      <InputString isMandatory={true} title={'Hello world!'} description={'This is where you type something'} type={'string'}/>

      
      <FileUpload accept='.png .jpg .zip' title='Profile picutre' description="Upload sm" allowMultiple={false}></FileUpload>
      
      <NewPassword></NewPassword>

      <InputCheckbox onToggle={(id) => { return }} label={"Hello world!"} options={checkboxOptions} description='Hello world!'></InputCheckbox>

      <InputRadio onToggle={() => { return }} options={options}></InputRadio>
      <InputChips maxArrayLength={10} validation={[validateEmail, "Incorrect data"]} title={"Invite users to register"} type='string' isMandatory={false}></InputChips>
    </section>
  );
}

export default PlaygroundPage;
