import { useCallback, useState } from "react";

export const useConnections = () => {
  const blessql = window.blessql;

  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);

  const res = blessql.getAllConnections();
  if (res) {
    setData(res);
  }

  const onAdd = useCallback(
    async (data) => {
      setLoading(true);
      await blessql.send("submit:createConnection", data);
      setLoading(false);
    },
    [blessql]
  );

  return {
    data: data || [],
    onAdd,
    loading: loading,
  };
};
