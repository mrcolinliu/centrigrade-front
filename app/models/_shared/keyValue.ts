interface IKeyValuePair<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export class KeyValuePair<TKey, TValue> implements IKeyValuePair<TKey, TValue> {
  key: TKey;
  value: TValue;
}
