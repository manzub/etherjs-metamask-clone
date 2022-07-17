import { useEffect, useState } from "react";

const controller = new AbortController();

export default function useOnlineStatus() {
  const [isOnline, setStatus] = useState(true);

  useEffect(() => {
    setInterval(() => {
      navigator.onLine && setStatus(true);
      const id = setTimeout(() => controller.abort(), 4000);

      try {
        fetch("https://httpbin.org/get", { signal: controller.signal }).then(response => {
          if (response.ok) setStatus(true)
          else setStatus(false)
        })
      } catch (error) {
        setStatus(false)
        console.log(error.message);
      }
      clearTimeout(id);
    }, 4999);
  })

  useEffect(() => {
    window.addEventListener("offline", setStatus(false))
  }, [setStatus])

  return isOnline;
}