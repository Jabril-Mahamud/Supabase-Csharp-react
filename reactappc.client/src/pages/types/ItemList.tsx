// src/components/ItemList.tsx
import React, { useState } from 'react';
import { Item } from '../types/Item';

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    const addItem = (name: string) => {
        const newItem: Item = {
            id: Date.now().toString(),
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setItems([...items, newItem]);
    };

    const updateItem = (id: string, newName: string) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, name: newName, updatedAt: new Date() } : item
        );
        setItems(updatedItems);
    };

    return (
        <div>
            <h1>Item List</h1>
            <button onClick={() => addItem('New Item')}>Add Item</button>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name} (Created: {item.createdAt.toLocaleString()}, Updated: {item.updatedAt.toLocaleString()})
                        <button onClick={() => updateItem(item.id, 'Updated Item')}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
