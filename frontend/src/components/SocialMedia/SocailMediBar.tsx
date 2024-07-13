import correct_icon from '../../assets/correct.png'
import DotsLoader from '../Loaders/DotsLoader/DotsLoader'
import Button from '../Button/Button'

interface ISocialMediaProps {
  isRefreshingToken: boolean
  isAuthenticated: boolean
  onClick: () => void
  icon: string
  name: string
}

const SocailMediBar = ({ isRefreshingToken, isAuthenticated, onClick, icon, name }: ISocialMediaProps) => {
  return (
    <div className="flex justify-between items-center mb-1">
      <img className="w-[60px] h-[60px] cursor-pointer " src={icon} />
      {isAuthenticated ? (
        <>
          <div className="flex">
            <p className="text-[green] mr-5">Authenticated</p>
            <img className="h-[30px]" src={correct_icon} />
          </div>
        </>
      ) : isRefreshingToken ? (
        <DotsLoader />
      ) : (
        <Button outlined onClick={onClick}>
          Continue with {name}
        </Button>
      )}
    </div>
  )
}

export default SocailMediBar
