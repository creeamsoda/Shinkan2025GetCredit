// 主人公がこのフレームで単位をどうした（取得or落単or何もしていない（手を伸ばして待っているか寝ている））かを示すための構造体
export const GetCreditResult = Object.freeze({
    Get: 0,
    Fail: 1,
    Stay: 2,
})