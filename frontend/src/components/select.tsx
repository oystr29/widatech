import type { JSX } from 'react'
import type {
  ClassNamesConfig,
  DropdownIndicatorProps,
  Props,
  StylesConfig,
} from 'react-select'
import type {
  AsyncPaginateProps,
  ComponentProps,
  UseAsyncPaginateParams,
} from 'react-select-async-paginate'
import type { CreatableProps } from 'react-select/creatable'
import { ChevronDown } from 'lucide-react'
import ReactSelect, { components } from 'react-select'
import { AsyncPaginate, withAsyncPaginate } from 'react-select-async-paginate'
import Creatable from 'react-select/creatable'

import { cn } from '~/lib/utils'

interface GroupBase<Option> {
  readonly options: readonly Option[]
  readonly label?: string
}

function classNames<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(): ClassNamesConfig<Option, IsMulti, Group> {
  return {
    control: ({ isFocused, isDisabled }) =>
      cn(
        'z-50 flex !min-h-10 w-full gap-2 rounded-md border border-input bg-transparent py-1 pl-3 pr-1 text-sm shadow-xs transition-colors hover:cursor-pointer',
        isFocused && 'outline-none ring-1 ring-ring',
        isDisabled && 'cursor-not-allowed opacity-50'
      ),
    placeholder: () => `text-sm text-muted-foreground`,
    // input: () => `pl-1 py-0.5`,
    valueContainer: () => `gap-1`,
    singleValue: () => {
      return cn('ml-1')
    },
    multiValue: (props) => {
      return `inline-flex items-center gap-2 rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        props.selectProps.placeholder === 'Pilih Perusahaan'
          ? 'first:bg-main-500 first:text-white dark:first:bg-main-900 dark:first:text-main-400'
          : ''
      }`
    },
    multiValueLabel: () => `leading-6 py-0.5 whitespace-nowrap text-sm`,
    multiValueRemove: () =>
      `border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 rounded-md`,
    indicatorsContainer: () => `gap-1`,
    clearIndicator: () => `p-1 rounded-md`,
    indicatorSeparator: () => `bg-border`,
    dropdownIndicator: () => `p-1 rounded-md`,
    menu: () =>
      `p-1 mt-1 border bg-popover shadow-md rounded-md text-popover-foreground z-50`,
    menuList: () => `scrollbar-thin dark:scrollbar-track-dark-body z-50`,
    groupHeading: () => `ml-3 mt-2 mb-1 text-gray-500 text-sm`,
    noOptionsMessage: () =>
      `text-gray-500 p-2 dark:bg-gray-900 bg-gray-50 border border-dashed dark:border-gray-500 border-gray-200 rounded-sm`,
    option: ({ isFocused, isSelected, isDisabled }) => {
      return cn(
        'z-50 !cursor-pointer !select-none rounded-sm px-2 py-1.5 font-sans !text-sm !outline-none hover:cursor-pointer hover:bg-accent hover:text-accent-foreground',
        isFocused && 'active:bg-accent/90 bg-accent text-accent-foreground',
        isDisabled && 'pointer-events-none opacity-50',
        isSelected && ''
      )
    },
  }
}

function styles<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(): StylesConfig<Option, IsMulti, Group> {
  return {
    input: (base) => ({
      ...base,
      'input:focus': {
        boxShadow: 'none',
      },
    }),
    multiValueLabel: (base) => ({
      ...base,
      whiteSpace: 'normal',
      overflow: 'visible',
    }),
    control: (base) => ({
      ...base,
      transition: 'none',
    }),
    menuList: (base) => ({
      ...base,
      '::-webkit-scrollbar': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'hsl(var(--border))',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'transparent',
      },
    }),
  }
}

function DropdownIndicator<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: DropdownIndicatorProps<Option, IsMulti, Group>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown
        size={16}
        className={cn('transition', props.isFocused && '-rotate-90')}
      />
    </components.DropdownIndicator>
  )
}

function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group> & { iconType?: string }) {
  return (
    <ReactSelect
      {...props}
      className={cn('w-full', props.className)}
      // menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      classNames={classNames<Option, IsMulti, Group>()}
      components={{ DropdownIndicator }}
      styles={{
        ...styles<Option, IsMulti, Group>(),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
          pointerEvents: 'visible',
        }),
      }}
      menuPosition={props.menuPosition ?? 'fixed'}
      unstyled
      hideSelectedOptions={true}
    />
  )
}

function SelectCreatable<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: CreatableProps<Option, IsMulti, Group> & { iconType?: string }) {
  return (
    <Creatable
      {...props}
      className={cn('w-full', props.className)}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      classNames={classNames<Option, IsMulti, Group>()}
      components={{ DropdownIndicator }}
      styles={{
        ...styles<Option, IsMulti, Group>(),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      menuPosition="fixed"
      unstyled
      hideSelectedOptions={true}
    />
  )
}

function SelectAsync<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false,
>(props: AsyncPaginateProps<OptionType, Group, Additional, IsMulti>) {
  return (
    <AsyncPaginate
      {...props}
      debounceTimeout={600}
      // menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      className={cn('w-full', props.className)}
      menuPosition={props.menuPosition ?? 'fixed'}
      components={{ DropdownIndicator }}
      classNames={classNames<OptionType, IsMulti, Group>()}
      styles={{
        ...styles<OptionType, IsMulti, Group>(),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
          pointerEvents: 'visible',
        }),
      }}
      unstyled
      closeMenuOnSelect
      //hideSelectedOptions={absolute}
    />
  )
}

// Creatable
type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false,
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => JSX.Element

const CreatableAsyncPaginate = withAsyncPaginate(
  Creatable
) as AsyncPaginateCreatableType

function SelectAsyncCreatable<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false,
>(props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>) {
  return (
    <CreatableAsyncPaginate
      {...props}
      debounceTimeout={600}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      className="mt-2 w-full"
      menuPosition="fixed"
      classNames={classNames<OptionType, IsMulti, Group>()}
      styles={{
        ...styles<OptionType, IsMulti, Group>(),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      unstyled
      closeMenuOnSelect
    />
  )
}

export { Select, SelectCreatable, SelectAsync, SelectAsyncCreatable }
