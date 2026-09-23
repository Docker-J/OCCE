/**
 * @file AddressAutocompleteInput.jsx
 * @description Google Places API (New) Autocomplete input for Canadian addresses
 * Automatically extracts street address and postal code using native MUI Autocomplete
 */

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SearchIcon from "@mui/icons-material/Search";

const AddressAutocompleteInput = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "도로명이나 번지수를 입력하여 공인 주소 검색 (예: 10405 Jasper Ave)",
  disabled = false,
  error = false,
  helperText = "",
}) => {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceTimerRef = useRef(null);

  // Debounced Place Autocomplete (Google Places API New)
  const fetchPredictions = async (query) => {
    if (!apiKey) {
      console.warn("[AddressAutocomplete] Google Maps API key is not configured.");
      setOptions([]);
      setLoading(false);
      return;
    }

    if (!query || query.trim().length < 2) {
      setOptions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input: query.trim(),
          includedRegionCodes: ["ca"],
          locationBias: {
            circle: {
              center: {
                latitude: 53.5461,
                longitude: -113.4938,
              },
              radius: 50000.0,
            },
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("[AddressAutocomplete] Google Places API error:", res.status, errorText);
        setOptions([]);
        return;
      }

      const data = await res.json();
      const suggestions = data.suggestions || [];
      const parsed = suggestions
        .filter((s) => s.placePrediction)
        .map((s) => {
          const p = s.placePrediction;
          return {
            placeId: p.placeId,
            description: p.text?.text || "",
            mainText: p.structuredFormat?.mainText?.text || p.text?.text || "",
            secondaryText: p.structuredFormat?.secondaryText?.text || "",
          };
        });

      setOptions(parsed);
      if (parsed.length > 0) {
        setOpen(true);
      }
    } catch (err) {
      console.error("[AddressAutocomplete] Failed to fetch address suggestions:", err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (newVal) => {
    setInputValue(newVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!newVal || newVal.trim().length < 2) {
      setOptions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPredictions(newVal);
    }, 200);
  };

  // Place Details (New) to extract structured address, city, province, and postal code
  const handleSelectOption = async (option) => {
    if (!option || !option.placeId) return;
    setOpen(false);

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${option.placeId}?fields=id,formattedAddress,addressComponents&key=${apiKey}`
      );

      if (!res.ok) {
        throw new Error(`Place Details failed with status ${res.status}`);
      }

      const place = await res.json();
      let streetNumber = "";
      let route = "";
      let city = "";
      let province = "";
      let postalCode = "";

      if (place.addressComponents) {
        for (const comp of place.addressComponents) {
          const types = comp.types || [];
          if (types.includes("street_number")) {
            streetNumber = comp.longText || comp.shortText || "";
          } else if (types.includes("route")) {
            route = comp.shortText || comp.longText || "";
          } else if (types.includes("locality") || types.includes("sublocality")) {
            if (!city) city = comp.longText || comp.shortText || "";
          } else if (types.includes("administrative_area_level_1")) {
            province = comp.shortText || comp.longText || "";
          } else if (types.includes("postal_code")) {
            postalCode = comp.shortText || comp.longText || "";
          }
        }
      }

      // Format street address (prefer streetNumber + route)
      let streetAddress = "";
      if (streetNumber && route) {
        streetAddress = `${streetNumber} ${route}`.trim();
      } else if (place.formattedAddress) {
        const parts = place.formattedAddress.replace(/, Canada$/i, "").split(",");
        streetAddress = (parts[0] || "").trim();
      } else {
        const parts = (option.description || "").replace(/, Canada$/i, "").split(",");
        streetAddress = (parts[0] || "").trim();
      }

      city = city || "Edmonton";
      province = province || "AB";

      if (postalCode) {
        const clean = postalCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (clean.length === 6) {
          postalCode = `${clean.slice(0, 3)} ${clean.slice(3)}`;
        } else {
          postalCode = postalCode.toUpperCase().trim();
        }
      }

      setInputValue("");
      if (onChange) onChange(streetAddress);
      onAddressSelect({
        address: streetAddress,
        city: city.trim(),
        province: province.trim(),
        postalCode: postalCode.trim(),
      });
    } catch (err) {
      console.warn("[AddressAutocomplete] Falling back to option description:", err);
      const fallback = option.description.replace(/, Canada$/i, "").trim();
      const parts = fallback.split(",");
      const streetAddress = (parts[0] || "").trim();
      const city = parts[1] ? parts[1].trim() : "Edmonton";
      setInputValue("");
      if (onChange) onChange(streetAddress);
      onAddressSelect({
        address: streetAddress,
        city,
        province: "AB",
        postalCode: "",
      });
    }
  };

  return (
    <Autocomplete
      fullWidth
      sx={{ width: "100%" }}
      freeSolo
      open={open && options.length > 0}
      onOpen={() => {
        if (options.length > 0) setOpen(true);
      }}
      onClose={() => setOpen(false)}
      disabled={disabled}
      options={options}
      getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.description || "")}
      filterOptions={(x) => x}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(e, newInputValue, reason) => {
        if (reason === "input") {
          handleInputChange(newInputValue);
        } else if (reason === "clear") {
          handleInputChange("");
        }
      }}
      onChange={(e, selected) => {
        setOpen(false);
        if (typeof selected === "string") {
          setInputValue(selected);
          onChange(selected);
        } else if (selected && selected.placeId) {
          handleSelectOption(selected);
        }
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key || option.placeId}
            component="li"
            {...optionProps}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, py: 1 }}
          >
            <LocationOnOutlinedIcon sx={{ color: "#ea580c", mt: 0.3, fontSize: "1.1rem" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#111" }}>
                {option.mainText}
              </Typography>
              {option.secondaryText && (
                <Typography variant="caption" sx={{ color: "#666" }}>
                  {option.secondaryText}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      slotProps={{
        popper: {
          sx: {
            zIndex: 1500,
            "& .MuiAutocomplete-paper": {
              borderRadius: "14px",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.16)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              mt: 1,
            },
            "& .MuiAutocomplete-listbox": {
              py: 1,
              maxHeight: "360px",
            },
          },
        },
      }}
      renderInput={(params) => {
        const mergedSlotProps = {
          ...params.slotProps,
          htmlInput: {
            ...params.slotProps?.htmlInput,
            autoComplete: "one-time-code",
            autoCorrect: "off",
            autoCapitalize: "none",
            spellCheck: "false",
            "data-1p-ignore": "true",
            "data-lpignore": "true",
            name: "address_search_query_no_autofill",
          },
          input: {
            ...params.slotProps?.input,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#2563eb", fontSize: "1.35rem" }} />
                </InputAdornment>
                {params.slotProps?.input?.startAdornment || null}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} /> : null}
                {params.slotProps?.input?.endAdornment || null}
              </>
            ),
          },
        };

        return (
          <TextField
            {...params}
            fullWidth
            size="medium"
            label="공인 주소 검색 (Google Places 주소 찾기)"
            placeholder={placeholder}
            error={error}
            helperText={helperText || "도로명이나 번지수를 입력하고 검색 결과에서 주소를 선택하면 아래 정보가 자동 완성됩니다."}
            autoComplete="one-time-code"
            inputProps={{
              ...params.inputProps,
              autoComplete: "one-time-code",
            }}
            slotProps={mergedSlotProps}
            sx={{
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: "1rem",
                minHeight: "52px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.95rem",
                fontWeight: 600,
              },
            }}
          />
        );
      }}
    />
  );
};

AddressAutocompleteInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddressSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default AddressAutocompleteInput;
