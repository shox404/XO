const DATA = {
    won: 16,
    lost: 7
}

export const dealer = (balance?: [number, number]) => {
    if (!balance || balance.length !== 2) {
        return 0;
    }
    return Math.max(0, balance[0] * DATA.won - balance[1] * DATA.lost);
}
