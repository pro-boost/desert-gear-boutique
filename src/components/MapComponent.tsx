import { useLanguage } from "@/contexts/LanguageContext";

const MapComponent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-[300px] w-full">
      <div className="overflow-hidden w-full h-full group">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.9522402356783!2d-5.548214609786988!3d33.86512170050147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda0454452435207%3A0xbcac173b743a8a49!2sInstitut%20Imam%20Ouarch%2C%20Filles%20Pour%20L&#39;%C3%A9ducation%20Musulmane!5e0!3m2!1sfr!2sma!4v1747336994354!5m2!1sfr!2sma"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Nidals Location"
          className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default MapComponent;
