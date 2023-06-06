import { ChangeEvent } from 'react'
import SearchIcon from 'src/assets/icons/search.svg'
import styled from 'styled-components'

const Wrap = styled.div`
  border: 1px solid #494c58;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  align-items: center;
  input {
    font-family: inherit;
    font-size: 12px;
    line-height: 16px;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    width: 100%;
  }
`
interface ISearchInputProps {
  placeholder: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ placeholder, onChange }: ISearchInputProps) {
  return (
    <Wrap className="search-input">
      <input placeholder={placeholder} onChange={onChange} />
      <img src={SearchIcon} alt="" />
    </Wrap>
  )
}
