import React, { createContext, useContext, useState } from 'react';

/**
 * UnitContext — global unit preferences shared across the whole app.
 * Wrapping AppInner in <UnitProvider> means unit selections in Settings
 * automatically update every card and modal without prop-drilling.
 * Consumed via the useUnits() hook.
 */
const UnitContext = createContext(null);

export const UnitProvider = ({ children }) => {
    const [tempUnit, setTempUnit] = useState('C');    // 'C' | 'F'
    const [speedUnit, setSpeedUnit] = useState('mph'); // 'mph' | 'kph' | 'kts'
    const [heightUnit, setHeightUnit] = useState('m'); // 'm' | 'ft'

    // Converts °C → °F; returns value unchanged for Celsius
    const convertTemp = (val) => {
        if (val == null) return val;
        if (tempUnit === 'F') return Math.round((val * 9/5 + 32) * 10) / 10;
        return val;
    };
    const tempLabel = () => tempUnit === 'C' ? '°C' : '°F';

    // API always returns mph — converts to kph (×1.60934) or knots (×0.868976) on demand
    const convertSpeed = (val) => {
        if (val == null) return val;
        if (speedUnit === 'kph') return Math.round(val * 1.60934 * 10) / 10;
        if (speedUnit === 'kts') return Math.round(val * 0.868976 * 10) / 10;
        return val; // mph — no conversion needed
    };
    const speedLabel = () => speedUnit;

    // API returns metres — converts to feet (×3.28084) when selected
    const convertHeight = (val) => {
        if (val == null) return val;
        if (heightUnit === 'ft') return Math.round(val * 3.28084 * 10) / 10;
        return val;
    };
    const heightLabel = () => heightUnit;

    return (
        <UnitContext.Provider value={{
            tempUnit, setTempUnit,
            speedUnit, setSpeedUnit,
            heightUnit, setHeightUnit,
            convertTemp, tempLabel,
            convertSpeed, speedLabel,
            convertHeight, heightLabel,
        }}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnits = () => useContext(UnitContext);
