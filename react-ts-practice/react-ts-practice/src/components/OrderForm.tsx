import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

declare global {
  interface Window {
    ymaps: any;
  }
}


const schema = z.object({
  name: z.string().min(1, 'Не заполнено поле ФИО'),
  phone: z.string().regex(/^\d+$/, 'Телефон должен содержать только цифры'),
  email: z.string().email({ message: 'Некорректный email' }),
  comment: z.string().max(500, 'Комментарий не должен превышать 500 символов').optional(),
});


type FormData = z.infer<typeof schema>;

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [coordError, setCoordError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapRef.current.innerHTML !== '') return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.76, 37.64],
        zoom: 10,
      });

      let placemark: any = null;

      map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        setCoords(coords);
        setCoordError('');

        if (!placemark) {
          placemark = new window.ymaps.Placemark(coords, {
            balloonContent: `Координаты: ${coords.map((n: number) => n.toFixed(4)).join(', ')}`,
          });
          map.geoObjects.add(placemark);
        } else {
          placemark.geometry.setCoordinates(coords);
          placemark.properties.set(
            'balloonContent',
            `Координаты: ${coords.map((n: number) => n.toFixed(4)).join(', ')}`
          );
        }

        placemark.balloon.open();
      });
    };

    if (window.ymaps) {
      window.ymaps.ready(initMap);
    }
  }, []);

  const onSubmit = (data: FormData) => {
    if (!coords) {
      setCoordError('Не отмечен адрес доставки');
      return;
    }

    console.log('Отправка заказа:', { ...data, coords });
    setSubmitted(true);
    reset();
    setCoords(null);
    setCoordError('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Оформление заказа</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input placeholder="ФИО" {...register('name')} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}

        <input placeholder="Телефон" {...register('phone')} />
        {errors.phone && <span style={{ color: 'red' }}>{errors.phone.message}</span>}

        <input placeholder="Email" {...register('email')} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

        <div
          ref={mapRef}
          style={{ height: 200, background: '#eee', border: '1px solid #aaa' }}
        />
        {coordError && <span style={{ color: 'red' }}>{coordError}</span>}

        <textarea
          placeholder="Комментарий к заказу (макс. 500 символов)"
          maxLength={500}
          {...register('comment')}
          rows={4}
          style={{ resize: 'none' }}
        />

        <button
          type="submit"
          style={{
            width: 'fit-content',
            alignSelf: 'center',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #aaa',
            background: '#f2f2f2',
            cursor: 'pointer',
          }}
        >
          Отправить
        </button>

        {submitted && (
          <div style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>
            Заказ оформлен!
          </div>
        )}
      </form>
    </div>
  );
}
