import React from 'react';
import './SelectedItems.css';

interface SelectedItemsProps {
    selectedItems: string[];
    onRemoveItem: (name: string) => void;
}

const SelectedItems: React.FC<SelectedItemsProps> = ({ selectedItems, onRemoveItem }) => {

    if (selectedItems.length === 0) {
        return <div className='emptyMessage'>No items selected</div>;
    }

    return (
        <div className="selected-items">
            {selectedItems.map((item, index) => (
                <div key={index} className="selected-item">
                    {item}
                    <button onClick={() => onRemoveItem(item)} className="remove-item-btn">X</button>
                </div>
            ))}
        </div>
    )
};

export default SelectedItems;
