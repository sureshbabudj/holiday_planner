"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { AutoComplete } from "./ui/AutoComplete";
import { Option } from "@/types";

export interface Address {
  latitude: number;
  longitude: number;
  geometry: Geometry;
  country: string;
  countryCode: string;
  countryFlag: string;
  distance: number;
  city: string;
  stateCode: string;
  state: string;
  layer: string;
  formattedAddress: string;
  addressLabel: string;
}

export type AddressOption = Address & Option;

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface AddressAutocompleteProps {
  value?: AddressOption;
  placeholder?: string;
  onValueChange?: (value: AddressOption | undefined) => void;
}

const url = "https://api.radar.io/v1/search/autocomplete";
// const url = "/api/dummy";
const radarToken = "prj_test_pk_befc3ea1d6615d799f0464facde134cefeee4b8a";

const AddressAutocomplete = ({
  value: input,
  placeholder,
  onValueChange,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [value, setValue] = useState<AddressOption | undefined>(input);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (value: string) => {
    try {
      const response = await axios.get(
        `${url}?query=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: radarToken,
          },
        }
      );
      const options: AddressOption[] = (
        response.data.addresses as Address[]
      ).map((i) => ({
        label: i.formattedAddress,
        value: i.formattedAddress,
        ...i,
      }));

      setSuggestions(options.length ? options : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleChange = (value: any) => {
    setIsLoading(true);
    setQuery(value);
  };

  useEffect(() => {
    if (!query) return;
    const getData = setTimeout(() => {
      sendRequest(query);
    }, 300);
    return () => clearTimeout(getData);
  }, [query]);

  useEffect(() => {
    onValueChange?.(value);
  }, [value, onValueChange]);

  return (
    <AutoComplete
      value={value}
      options={suggestions}
      isLoading={isLoading}
      onValueChange={(v) => v && setValue(v as AddressOption)}
      onInputChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default AddressAutocomplete;
