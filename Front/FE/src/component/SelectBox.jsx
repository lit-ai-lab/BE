import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

const SelectBox = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optionKey,
  optionLabel,
  placeholder = '전체',
  disabled = false,
}) => {
  const selected =
    options.find((opt) => opt[optionKey] === value) || {
      [optionKey]: '',
      [optionLabel]: placeholder,
    };

  const handleSelect = (val) => {
    const e = { target: { name, value: val[optionKey] } };
    onChange(e);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
      )}
      <Listbox value={selected} onChange={handleSelect} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100">
            <span className="block break-keep whitespace-nowrap">
              {selected[optionLabel]}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Listbox.Option
              key="all"
              value={{ [optionKey]: '', [optionLabel]: placeholder }}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-slate-100 text-slate-900' : 'text-gray-700'
                }`
              }
            >
              {placeholder}
            </Listbox.Option>
            {options.map((opt, idx) => (
              <Listbox.Option
                key={idx}
                value={opt}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-slate-100 text-slate-900' : 'text-gray-700'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {opt[optionLabel]}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Check className="w-4 h-4 text-slate-600" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default SelectBox;
