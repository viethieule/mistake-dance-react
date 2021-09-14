export const updateItem = (items, id, itemAttributes) => {
    const index = items.findIndex(x => x.id === id);
    if (index === -1) {
        return items;
    } else {
        return [
            ...items.slice(0,index),
            Object.assign({}, items[index], itemAttributes),
            ...items.slice(index+1)
         ]
    }
} 