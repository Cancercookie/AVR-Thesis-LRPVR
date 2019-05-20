using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using Valve.VR;

public class Crossair : BaseInputModule
{
    public Camera m_Camera;
    public SteamVR_Input_Sources m_TargetSource;
    public SteamVR_Action_Boolean m_ClickAction;

    private GameObject m_CurrentGameObject = null;
    private PointerEventData m_Data = null;
    private ArticleUI articleUI;
    private cartHandler cart;
    private BuyHandler buyHandler;
    private Image dot;
    private websockets WS;

    protected override void Awake()
    {
        base.Awake();
        WS = GameObject.Find("Store").GetComponent<websockets>();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
        cart = GameObject.Find("ArticleUI/Canvas/AddToCartBtn/AddToCart").GetComponent<cartHandler>();
        buyHandler = GameObject.Find("Store/Checkout/CheckoutCanvas/Buy").GetComponent<BuyHandler>();
        dot = m_Camera.GetComponentInChildren<Image>();
        m_Data = new PointerEventData(eventSystem);
    }

    public override void Process()
    {
        UpdatePosition();
        m_Data.Reset();
        m_Data.position = new Vector2(m_Camera.pixelWidth / 2, m_Camera.pixelHeight / 2);
        eventSystem.RaycastAll(m_Data, m_RaycastResultCache);
        m_Data.pointerCurrentRaycast = FindFirstRaycast(m_RaycastResultCache);
        m_CurrentGameObject = m_Data.pointerCurrentRaycast.gameObject;
        m_RaycastResultCache.Clear();
        HandlePointerExitAndEnter(m_Data, m_CurrentGameObject);
        if (m_ClickAction.GetStateDown(m_TargetSource))
            ProcessPress(m_Data);
        if (m_ClickAction.GetStateUp(m_TargetSource))
            ProcessRelease(m_Data);
    }

    public PointerEventData GetData()
    {
        return m_Data;
    }

    private void ProcessPress(PointerEventData data)
    {
        Debug.Log("PRESS: " + m_CurrentGameObject.name);
        string buy = m_CurrentGameObject.name;
        if (buy == "Buy" && WS.qtInCart > 0)
        {
            buyHandler.buyAll();
        }
        else if (articleUI.isActiveAndOpened())
        {
            cartHandler cH = m_CurrentGameObject.GetComponent<cartHandler>();
            if (cH != null)
                cH.addToCart();
        }
    }

    private void ProcessRelease(PointerEventData data)
    {
        Debug.Log("RELEASE: " + m_CurrentGameObject.name);
    }

    private void UpdatePosition()
    {
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward, out hit, 5f))
        {
            var article = hit.transform.GetComponent<Article>();
            var hitName = hit.transform.name;
            if (hit.collider != null)
                dot.transform.position = hit.point;
            else
                dot.transform.position = transform.position + (transform.position * 5f);
            if (article != null || hitName == "Buy")
                dot.color = Color.green;
            else
                dot.color = Color.red;
        }
    }
}