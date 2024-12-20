"use client"
export const Select = ({ options, onSelect, value }: {
    onSelect: (value: string) => void;
    options: {
        key: string;
        value: string;
    }[];
    value?:string
}) => {
    return <select 
        value={value || ""}
        onChange={(e) => {
        onSelect(e.target.value)
    }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <option value="">Select Option</option>
        {options.map(option => <option value={option.key} key={option.key}>{option.value}</option>)}
  </select>
}